import { useEffect, useId, useState } from 'react';
import FieldError from './FieldError';
import { formatCurrency } from '../services/pricing';
import { createTaxBracket, deleteTaxBracket, getTaxBrackets, updateTaxBracket } from '../services/taxApi';
import { currentTaxYear, taxYearLabel } from '../services/taxYear';

//(National Treasury, 2026)
const SARS_REFERENCE_YEAR = '2027';
const SARS_REFERENCE_BRACKETS = [
  { minimumIncome: 0, maximumIncome: 245100, taxRate: 18, baseTax: 0 },
  { minimumIncome: 245100, maximumIncome: 383100, taxRate: 26, baseTax: 44118 },
  { minimumIncome: 383100, maximumIncome: 530200, taxRate: 31, baseTax: 79998 },
  { minimumIncome: 530200, maximumIncome: 695800, taxRate: 36, baseTax: 125599 },
  { minimumIncome: 695800, maximumIncome: 887000, taxRate: 39, baseTax: 185215 },
  { minimumIncome: 887000, maximumIncome: 1878600, taxRate: 41, baseTax: 259783 },
  { minimumIncome: 1878600, maximumIncome: null, taxRate: 45, baseTax: 666339 },
];

const emptyForm = { minimumIncome: '', maximumIncome: '', taxRate: '', baseTax: '' };

function sortBrackets(brackets) {
  return [...brackets].sort((first, second) => first.minimumIncome - second.minimumIncome);
}

function parseAmount(value) {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const amount = Number(trimmed);
  return Number.isFinite(amount) ? amount : Number.NaN;
}

function overlapsAny(bracket, brackets) {
  return brackets.some((other) => bracket.minimumIncome < (other.maximumIncome ?? Infinity) && (bracket.maximumIncome ?? Infinity) > other.minimumIncome);
}

function incomeRange(bracket) {
  return bracket.maximumIncome === null || bracket.maximumIncome === undefined
    ? `${formatCurrency(bracket.minimumIncome)} and above`
    : `${formatCurrency(bracket.minimumIncome)} – ${formatCurrency(bracket.maximumIncome)}`;
}

function isSameBracket(first, second) {
  return first.minimumIncome === second.minimumIncome && (first.maximumIncome ?? null) === (second.maximumIncome ?? null) && first.taxRate === second.taxRate;
}

function toFormValues(bracket) {
  return {
    minimumIncome: String(bracket.minimumIncome),
    maximumIncome: bracket.maximumIncome === null ? '' : String(bracket.maximumIncome),
    taxRate: String(bracket.taxRate),
    baseTax: String(bracket.baseTax ?? 0),
  };
}

export default function TaxBracketsPage({ session, onSessionExpired }) {
  //(React, s.a.c)
  const formId = useId();
  const thisTaxYear = currentTaxYear();
  const yearOptions = [String(Number(thisTaxYear) - 1), thisTaxYear, String(Number(thisTaxYear) + 1)];
  //(React, s.a.a)
  const [taxYear, setTaxYear] = useState(thisTaxYear);
  const [brackets, setBrackets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingID, setEditingID] = useState(null);
  const [pendingDeleteID, setPendingDeleteID] = useState(null);
  const [notice, setNotice] = useState(null);
  const isAdmin = session.role === 'admin';

  //(React, s.a.b)
  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return undefined;
    }

    let isCurrent = true;

    getTaxBrackets(session.token, { taxYear })
      .then((results) => {
        if (isCurrent) setBrackets(sortBrackets(results));
      })
      .catch((error) => {
        if (!isCurrent) return;
        if (error.status === 401) {
          onSessionExpired();
          return;
        }
        setNotice({ type: 'error', text: error.message });
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [isAdmin, session, taxYear]);

  function handleFailure(error) {
    if (error.status === 401) {
      onSessionExpired();
      return;
    }
    setNotice({ type: 'error', text: error.message });
  }

  function changeTaxYear(event) {
    setTaxYear(event.target.value);
    setIsLoading(true);
    setBrackets([]);
    setValues(emptyForm);
    setErrors({});
    setEditingID(null);
    setPendingDeleteID(null);
    setNotice(null);
  }

  function updateValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    const bracket = {
      minimumIncome: parseAmount(values.minimumIncome),
      maximumIncome: parseAmount(values.maximumIncome),
      taxRate: parseAmount(values.taxRate),
      baseTax: parseAmount(values.baseTax) ?? 0,
    };

    if (bracket.minimumIncome === null || Number.isNaN(bracket.minimumIncome) || bracket.minimumIncome < 0) nextErrors.minimumIncome = 'Enter the income this bracket starts at (0 or more).';
    if (Number.isNaN(bracket.maximumIncome) || (bracket.maximumIncome !== null && !nextErrors.minimumIncome && bracket.maximumIncome <= bracket.minimumIncome)) nextErrors.maximumIncome = 'Enter an amount above the minimum, or leave it blank for the top bracket.';
    if (bracket.taxRate === null || Number.isNaN(bracket.taxRate) || bracket.taxRate < 0 || bracket.taxRate > 100) nextErrors.taxRate = 'Enter a tax rate between 0 and 100.';
    if (Number.isNaN(bracket.baseTax) || bracket.baseTax < 0) nextErrors.baseTax = 'Enter a base tax of 0 or more.';
    if (Object.keys(nextErrors).length === 0 && overlapsAny(bracket, brackets.filter((other) => other._id !== editingID))) nextErrors.maximumIncome = `This range overlaps a bracket already set for ${taxYear}.`;

    return { nextErrors, bracket };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice(null);

    const { nextErrors, bracket } = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (editingID) {
        const updated = await updateTaxBracket(session.token, editingID, bracket);
        setBrackets((current) => sortBrackets(current.map((item) => (item._id === editingID ? updated : item))));
        setEditingID(null);
        setValues(emptyForm);
        setNotice({ type: 'success', text: `Updated the ${incomeRange(updated)} bracket for ${taxYear}.` });
      } else {
        const created = await createTaxBracket(session.token, { taxYear, ...bracket });
        setBrackets((current) => sortBrackets([...current, created]));
        setValues({ ...emptyForm, minimumIncome: bracket.maximumIncome === null ? '' : String(bracket.maximumIncome) });
        setNotice({ type: 'success', text: `Added the ${incomeRange(created)} bracket at ${created.taxRate}% for ${taxYear}.` });
      }
    } catch (error) {
      handleFailure(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEdit(bracket) {
    setEditingID(bracket._id);
    setPendingDeleteID(null);
    setValues(toFormValues(bracket));
    setErrors({});
    setNotice(null);
  }

  function cancelEdit() {
    setEditingID(null);
    setValues(emptyForm);
    setErrors({});
  }

  async function handleDelete(bracket) {
    if (pendingDeleteID !== bracket._id) {
      setPendingDeleteID(bracket._id);
      return;
    }

    setNotice(null);
    try {
      await deleteTaxBracket(session.token, bracket._id);
      setBrackets((current) => current.filter((item) => item._id !== bracket._id));
      if (editingID === bracket._id) cancelEdit();
      setNotice({ type: 'success', text: `Deleted the ${incomeRange(bracket)} bracket for ${taxYear}.` });
    } catch (error) {
      handleFailure(error);
    } finally {
      setPendingDeleteID(null);
    }
  }

  function applyReferenceBracket(bracket) {
    setValues(toFormValues(bracket));
    setErrors({});
    setNotice(null);
  }

  const fields = [
    { name: 'minimumIncome', label: 'Minimum income (R)', hint: 'Use the previous bracket’s maximum so the brackets join up.' },
    { name: 'maximumIncome', label: 'Maximum income (R)', hint: 'Leave blank for the top bracket.' },
    { name: 'taxRate', label: 'Tax rate (%)', hint: 'Between 0 and 100.' },
    { name: 'baseTax', label: 'Base tax (R)', hint: 'Optional. Tax on the income below this bracket.' },
  ];

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1>Tax brackets</h1>
          <p>Set the income tax brackets the tax estimate uses for each tax year. Brackets in the same year cannot overlap.</p>
        </div>
        {isAdmin && (
          <div className="year-picker">
            <label htmlFor={`${formId}-year`}>Tax year</label>
            <select id={`${formId}-year`} value={taxYear} onChange={changeTaxYear}>
              {yearOptions.map((year) => <option key={year} value={year}>{year} ({taxYearLabel(year)})</option>)}
            </select>
          </div>
        )}
      </header>

      {notice && <div className={`notice ${notice.type}`} role="status">{notice.text}</div>}

      {!isAdmin ? (
        <p className="empty-state">Only administrators can manage tax brackets.</p>
      ) : (
        <>
          <section className="panel" aria-labelledby="brackets-heading">
            <h2 id="brackets-heading">Brackets for {taxYear}</h2>
            {isLoading ? (
              <p className="panel-empty" role="status">Loading tax brackets…</p>
            ) : brackets.length === 0 ? (
              <p className="panel-empty">No brackets have been set for the {taxYear} tax year. Tax estimates for this year will come out as R 0 until you add them.</p>
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr><th scope="col">Taxable income</th><th scope="col">Rate</th><th scope="col">Base tax</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr>
                  </thead>
                  <tbody>
                    {brackets.map((bracket) => (
                      <tr key={bracket._id}>
                        <th scope="row">{incomeRange(bracket)}</th>
                        <td>{bracket.taxRate}%</td>
                        <td>{formatCurrency(bracket.baseTax ?? 0)}</td>
                        <td>
                          <div className="table-actions">
                            {pendingDeleteID === bracket._id ? (
                              <>
                                <button type="button" className="secondary-button" onClick={() => setPendingDeleteID(null)}>Keep</button>
                                <button type="button" className="danger-button" onClick={() => handleDelete(bracket)} aria-label={`Confirm delete ${incomeRange(bracket)}`}>Confirm delete</button>
                              </>
                            ) : (
                              <>
                                <button type="button" className="secondary-button" onClick={() => startEdit(bracket)} aria-label={`Edit ${incomeRange(bracket)}`}>Edit</button>
                                <button type="button" className="secondary-button" onClick={() => handleDelete(bracket)} aria-label={`Delete ${incomeRange(bracket)}`}>Delete</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel" aria-labelledby="add-bracket-heading">
            <h2 id="add-bracket-heading">{editingID ? 'Edit bracket' : 'Add a bracket'}</h2>
            <form className="bracket-form" onSubmit={handleSubmit} noValidate>
              <div className="bracket-fields">
                {fields.map((field) => (
                  <div className="form-field" key={field.name}>
                    <label htmlFor={`${formId}-${field.name}`}>{field.label}</label>
                    <input id={`${formId}-${field.name}`} name={field.name} type="number" inputMode="decimal" min="0" step="any" value={values[field.name]} onChange={updateValue} aria-invalid={Boolean(errors[field.name])} aria-describedby={`${formId}-${field.name}-hint`} />
                    <p className="field-hint" id={`${formId}-${field.name}-hint`}>{field.hint}</p>
                    <FieldError>{errors[field.name]}</FieldError>
                  </div>
                ))}
              </div>
              <div className="form-actions">
                <button type="submit" className="primary-button" disabled={isSubmitting || isLoading}>{isSubmitting ? 'Saving…' : editingID ? 'Save changes' : `Add bracket to ${taxYear}`}</button>
                {editingID ? (
                  <button type="button" className="secondary-button" onClick={cancelEdit}>Cancel</button>
                ) : (
                  <button type="button" className="secondary-button" onClick={() => { setValues(emptyForm); setErrors({}); }}>Clear</button>
                )}
              </div>
            </form>
          </section>

          {taxYear === SARS_REFERENCE_YEAR && (
            <section className="panel" aria-labelledby="sars-heading">
              <h2 id="sars-heading">SARS brackets for {SARS_REFERENCE_YEAR}</h2>
              <p className="panel-note">From the Budget 2026 Tax Guide (1 March 2026 – 28 February 2027). Choose Use to fill the form, check it, then add it.</p>
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr><th scope="col">Taxable income</th><th scope="col">Rate</th><th scope="col">Base tax</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr>
                  </thead>
                  <tbody>
                    {SARS_REFERENCE_BRACKETS.map((bracket) => {
                      const isAdded = brackets.some((existing) => isSameBracket(existing, bracket));
                      return (
                        <tr key={bracket.minimumIncome}>
                          <th scope="row">{incomeRange(bracket)}</th>
                          <td>{bracket.taxRate}%</td>
                          <td>{formatCurrency(bracket.baseTax)}</td>
                          <td>
                            <div className="table-actions">
                              {isAdded ? <span className="gig-badge paid">Added</span> : <button type="button" className="secondary-button" onClick={() => applyReferenceBracket(bracket)} aria-label={`Use ${incomeRange(bracket)}`}>Use</button>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

/*
National Treasury, 2026. Budget 2026 Tax Guide. [online] Available at:
<https://www.treasury.gov.za/documents/national%20budget/2026/sars/Budget%202026%20Tax%20guide.pdf>
[Accessed 9 November 2026]

React, s.a.a. useState. [online] Available at:
<https://react.dev/reference/react/useState>
[Accessed 9 November 2026]

React, s.a.b. useEffect. [online] Available at:
<https://react.dev/reference/react/useEffect>
[Accessed 9 November 2026]

React, s.a.c. useId. [online] Available at:
<https://react.dev/reference/react/useId>
[Accessed 9 November 2026]
*/

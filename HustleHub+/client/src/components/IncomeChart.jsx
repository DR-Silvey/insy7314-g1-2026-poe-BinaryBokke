import { formatCurrency } from '../services/pricing';

//(MDN Web Docs, 2026e)
const compact = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', notation: 'compact', maximumFractionDigits: 1 });

function niceMaximum(value) {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((multiplier) => multiplier * magnitude >= value);
  return step * magnitude;
}

//(W3C Web Accessibility Initiative, 2026)
export default function IncomeChart({ months, label }) {
  const scaleMaximum = niceMaximum(Math.max(...months.map((month) => month.total)));
  //(MDN Web Docs, 2026d)
  const peak = months.reduce((best, month) => (month.total > best.total ? month : best), months[0]);
  const ticks = [scaleMaximum, scaleMaximum / 2, 0];

  return (
    <figure className="income-chart" aria-label={label}>
      <div className="income-chart-plot">
        <div className="income-chart-axis" aria-hidden="true">
          {ticks.map((tick) => <span key={tick}>{compact.format(tick)}</span>)}
        </div>
        <ol className="income-chart-bars">
          {months.map((month) => {
            const height = (month.total / scaleMaximum) * 100;
            const description = `${month.label} ${month.year}: ${formatCurrency(month.total)}`;

            return (
              <li key={`${month.label}-${month.year}`} className="income-chart-slot" tabIndex={0} aria-label={description}>
                <span className="income-chart-column">
                  {month.total > 0 && <span className="income-chart-bar" style={{ height: `${height}%` }} />}
                  {month === peak && month.total > 0 && <span className="income-chart-value" style={{ bottom: `calc(${height}% + 6px)` }}>{compact.format(month.total)}</span>}
                  <span className="income-chart-tooltip" role="tooltip" style={{ bottom: `calc(${height}% + 6px)` }}>{description}</span>
                </span>
                <span className="income-chart-label" aria-hidden="true">{month.label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}

/*
MDN Web Docs, 2026d. Array.prototype.reduce(). [online] Available at:
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce>
[Accessed 9 November 2026]

MDN Web Docs, 2026e. Intl.NumberFormat() constructor. [online] Available at:
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat>
[Accessed 9 November 2026]

W3C Web Accessibility Initiative, 2026. Tooltip Pattern. [online] Available at:
<https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/>
[Accessed 9 November 2026]
*/

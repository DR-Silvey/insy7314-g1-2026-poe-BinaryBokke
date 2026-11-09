const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const user = require('../../models/users');
const TwoFactor = require('../../models/twoFactorAuth/twoFactorAuth');
const TokenCreation = require('../../utils/tokens/TokenCreation');
const SendEmail = require('../../utils/email/EmailHandler');

const DEVICE_COOKIE = 'hustlehub_device';

//(The IIE, 2026)(W3 Schools, s.a.)
const ClassifyDevice = async (req, res) => {
    try {
        const { classificationToken, location } = req.body; //(The IIE, 2026)(W3 Schools, s.a.)

        //Only these three classifications of devices are allowed: HOME, WORK, AWAY
        const allowedLocations = ['HOME', 'WORK', 'AWAY'];

        if (!classificationToken) {
            return res.status(400).json({
                error: 'Classification token is required'

            });

        }

        if (!allowedLocations.includes(location)) {
            return res.status(400).json({
                error: 'Location must be HOME, WORK or AWAY'

            });

        }

        //Verify the temporary classification token
        let decoded;

        try {
            decoded = jwt.verify(classificationToken, process.env.TWO_FACTOR_JWT_SECRET);

        } 
        catch (error) {
            return res.status(401).json({
                error: 'Invalid or expired classification session'

            });

        }

        if (decoded.purpose !== 'DEVICE_CLASSIFICATION') {
            return res.status(401).json({
                error: 'Invalid classification session'

            });

        }

        //Confirm the browser still has the device cookie
        const deviceToken = req.cookies?.[DEVICE_COOKIE];

        if (!deviceToken) { //(The IIE, 2026)(W3 Schools, s.a.)
            return res.status(401).json({
                error: 'Recognised device cookie is missing. Please log in again.'

            });

        }

        //Hash the cookie and compare it with the signed token
        const deviceTokenHash = crypto
            .createHash('sha256')
            .update(deviceToken)
            .digest('hex');

        if (deviceTokenHash !== decoded.deviceTokenHash) {
            return res.status(401).json({
                error: 'Device verification failed. Please log in again.'

            });

        }

        const foundUser = await user.findById(decoded.userId); //(The IIE, 2026)(W3 Schools, s.a.)

        if (!foundUser) {
            return res.status(404).json({
                error: 'User not found'

            });

        }

        const twoFactor = await TwoFactor.findOne({ user: foundUser._id });

        if (!twoFactor || !twoFactor.enabled) {
            return res.status(400).json({
                error: 'Two-factor verification is unavailable'

            });

        }

        //Checking whether this browser is already recognised
        const existingDevice = twoFactor.devices.find(
            device => device.tokenHash === deviceTokenHash

        );

        //Preventing two browsers from occupying the same classification
        const occupiedSlot = twoFactor.devices.find(
            device =>
                device.location === location &&
                device.tokenHash !== deviceTokenHash

        );

        //(The IIE, 2026)(W3 Schools, s.a.)
        if (occupiedSlot) {
            return res.status(409).json({
                error: `You already have a recognised ${location} browser.`,
                slotAlreadyUsed: true,
                occupiedLocation: location

            });

        }

        if (existingDevice) {
            //Updating the existing browser instead of creating a duplicate
            const previousLocation = existingDevice.location;

            existingDevice.location = location;
            existingDevice.lastSeenAt = new Date();

            //If it becomes Away again, allow a future reclassification prompt
            if (previousLocation !== 'AWAY' && location === 'AWAY') {
                existingDevice.classificationPrompted = false;

            }

        } 
        else {
            // Register this new browser.
            twoFactor.devices.push({
                tokenHash: deviceTokenHash,
                location,
                createdAt: new Date(),
                lastSeenAt: new Date(),
                loginCount: 1,
                classificationPrompted: false

            });

        }

        await twoFactor.save();

        //Notify the user when a browser completes an Away login
        if (location === 'AWAY') {
            try {
                await SendEmail(
                    foundUser.email,
                    'HustleHub: Away device login',
                    'A successful login was made to your HustleHub account from a browser classified as AWAY. If this was not you, secure your account immediately.'
                
                );
            } 
            catch (emailError) {
                console.error('Away login notification failed:', emailError);

            }

        }

        //Only issue the normal access token after classification succeeds
        const token = TokenCreation(foundUser.username, foundUser.role);

        return res.status(200).json({
            message: 'Device successfully classified. Login successful.',
            location,
            token

        });

    } 
    catch (error) { //(The IIE, 2026)(W3 Schools, s.a.)
        console.error('Device classification error:', error);

        return res.status(500).json({
            error: 'Something went wrong'

        });

    }

};

module.exports = ClassifyDevice;
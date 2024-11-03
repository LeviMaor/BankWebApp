const cron = require('node-cron');
const User = require('../models/User'); 

// Schedule a cron job to run every 24 hours (at midnight)
cron.schedule('0 0 * * *', async () => {
    try {
        // Calculate the time threshold (24 hours ago)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Delete unverified accounts older than 24 hours
        const result = await User.deleteMany({
            isVerified: false,
            createdAt: { $lt: twentyFourHoursAgo }
        });

        console.log(`Cleanup completed. Deleted ${result.deletedCount} unverified accounts.`);
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
});

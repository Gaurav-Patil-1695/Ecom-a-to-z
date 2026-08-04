/**
 * @typedef {Object} DashboardStats
 * @property {number} totalOrders - Total number of orders
 * @property {number} totalRevenue - Total revenue in smallest currency unit (e.g. paise)
 * @property {number} totalUsers - Total number of registered users
 * @property {number} totalProducts - Total number of products
 * @property {number} pendingOrders - Number of orders with pending status
 * @property {number} pendingReturns - Number of pending return requests
 * @property {number} totalCategories - Total number of categories
 * @property {number} totalBrands - Total number of brands
 * @property {string} updatedAt - ISO timestamp of when the stats were last computed
 */

/**
 * @typedef {Object} ReportDataPoint
 * @property {string} date - ISO date string for this data point
 * @property {number} revenue - Revenue in smallest currency unit for this period
 * @property {number} orders - Number of orders for this period
 * @property {number} newUsers - Number of new user registrations for this period
 * @property {number} returns - Number of return requests for this period
 */

/**
 * @typedef {Object} ReportData
 * @property {string} from - ISO timestamp of the report start date
 * @property {string} to - ISO timestamp of the report end date
 * @property {string} granularity - Granularity of the report ('daily', 'weekly', 'monthly')
 * @property {ReportDataPoint[]} dataPoints - Array of report data points
 * @property {number} totalRevenue - Aggregate total revenue for the period in smallest currency unit
 * @property {number} totalOrders - Aggregate total number of orders for the period
 * @property {number} totalNewUsers - Aggregate total number of new users for the period
 * @property {number} totalReturns - Aggregate total number of return requests for the period
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id - Unique user identifier
 * @property {string} email - User email address
 * @property {string} firstName - User first name
 * @property {string} lastName - User last name
 * @property {string} phone - User phone number
 * @property {string[]} roles - Array of role names assigned to the user
 * @property {boolean} isGuest - Whether the user is a guest
 * @property {number} orderCount - Total number of orders placed by this user
 * @property {number} totalSpend - Total amount spent in smallest currency unit (e.g. paise)
 * @property {string} createdAt - ISO timestamp of account creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

export {};

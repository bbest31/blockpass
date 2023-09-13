export const TIER_STATE = {
  active: 'active',
  pending: 'pending',
  paused: 'paused',
  closed: 'closed',
  soldOut: 'soldOut',
};

/**
 * Given a ticket tier this function returns the string representing the state of the ticket tier.
 * active - tickets are available for purchase
 * pending - the tier live date is in the future, so tickets aren't on sale yet.
 * paused - the ability to mint tickets from the tier contract is paused.
 * closed - the close date of the tier has passed, and tickets are no longer available for purchase.
 * soldOut - the entire supply of tickets has been sold for this tier.
 * @param {Object} data 
 * @returns {string}
 */
export const determineTierState = (data) => {
  if (data) {
    const closeDate = new Date(data.closeDate);
    const liveDate = new Date(data.liveDate);
    if (parseInt(data.totalticketsForSale, 10) === 0) return TIER_STATE.soldOut;
    if (closeDate <= new Date()) return TIER_STATE.closed;
    if (data.paused) return TIER_STATE.paused;
    if (liveDate > new Date()) return TIER_STATE.pending;
    return TIER_STATE.active;
  }
  return TIER_STATE.closed;
};

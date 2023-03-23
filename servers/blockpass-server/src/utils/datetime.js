function convertEpochToDate(UTCSeconds) {
  const date = new Date(0);
  date.setUTCSeconds(UTCSeconds);
  return date;
}

const DateTime = { convertEpochToDate };

module.exports = DateTime;

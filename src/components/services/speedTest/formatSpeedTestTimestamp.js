import moment from "moment";

// Details timestamps have no timezone; ISO history timestamps retain their offset.
export default function formatSpeedTestTimestamp(value) {
  if (value == null || value === "") return "---";
  let timestamp;
  if (typeof value === "number") {
    timestamp = moment(Math.abs(value) < 1e12 ? value * 1000 : value);
  } else if (value instanceof Date) {
    timestamp = moment(value);
  } else if (typeof value === "string") {
    timestamp = moment(value.trim(), [
      moment.ISO_8601,
      "MM/DD/YYYY HH:mm:ss",
      "MM/D/YYYY HH:mm:ss",
      "M/DD/YYYY HH:mm:ss",
      "M/D/YYYY HH:mm:ss",
      "M/D/YYYY, h:mm:ss A",
      "M/D/YYYY, h:mm A",
      "M/D/YYYY h:mm:ss A",
      "M/D/YYYY h:mm A",
    ], true);
  }
  return timestamp?.isValid() ? timestamp.local().format("MM/DD/YY hh:mm A") : "---";
}

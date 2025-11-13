import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

import { DATE_TIME } from "@/core/helpers/consts";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export function formatDate(
  date: Dayjs | string | Date,
  dateFormat: string = DATE_TIME.STANDARD_DATE_FORMAT_INVERSE,
) {
  if (date) {
    if (typeof date === "object" && "format" in date) {
      return date.format(dateFormat);
    } else {
      return dayjs(date).format(dateFormat);
    }
  }
  return null;
}

export function formatTime(
  time: Dayjs,
  timeFormat: string = DATE_TIME.STANDARD_TIME_FORMAT,
) {
  if (!time) return null;
  if (typeof time === "object" && "format" in time) {
    return time.format(timeFormat);
  }
  return dayjs(time).format(timeFormat);
}

export function formatDateTime(
  time: Dayjs,
  dateTimeFormat: string = DATE_TIME.STANDARD_DATE_FORMAT_FULL,
) {
  if (!time) return null;
  if (typeof time === "object" && "format" in time) {
    return time.format(dateTimeFormat);
  }
  return dayjs(time).format(dateTimeFormat);
}

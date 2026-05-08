const MOLDOVA_TIME_ZONE = 'Europe/Chisinau';

const toMoldovaDateTimeInput = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: MOLDOVA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const getPart = (type) => parts.find((part) => part.type === type)?.value;

  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hour = getPart('hour') === '24' ? '00' : getPart('hour');
  const minute = getPart('minute');

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const normalizeDateTimeValue = (value) => {
  if (!value) return '';

  if (value instanceof Date) {
    return toMoldovaDateTimeInput(value);
  }

  return String(value)
    .trim()
    .replace(' ', 'T')
    .replace(/Z$/, '')
    .replace(/\.\d+$/, '')
    .slice(0, 16);
};

const isValidDateTimeLocal = (value) => {
  const normalizedValue = normalizeDateTimeValue(value);
  const match = normalizedValue.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
  );

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getUTCHours() === hour &&
    date.getUTCMinutes() === minute
  );
};

const getMoldovaDateTimeAfterMinutes = (minutes = 0) => {
  return toMoldovaDateTimeInput(new Date(Date.now() + minutes * 60 * 1000));
};

const isAtLeastMinutesInFutureMoldova = (value, minutes = 0) => {
  return normalizeDateTimeValue(value) >= getMoldovaDateTimeAfterMinutes(minutes);
};

const isBeforeOrEqualMoldovaNow = (value) => {
  return normalizeDateTimeValue(value) <= getMoldovaDateTimeAfterMinutes(0);
};

module.exports = {
  MOLDOVA_TIME_ZONE,
  normalizeDateTimeValue,
  isValidDateTimeLocal,
  isAtLeastMinutesInFutureMoldova,
  isBeforeOrEqualMoldovaNow,
  getMoldovaDateTimeAfterMinutes,
};
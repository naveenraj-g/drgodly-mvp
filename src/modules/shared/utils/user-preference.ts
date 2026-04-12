import moment from "moment-timezone";

type Preferences = {
  country?: string;
  scope?: "GLOBAL" | "COUNTRY";
  currency?: string;
  dateFormat?: string;
  numberFormat?: string;
  timezone?: string;
  measurementSystem?: string;
  weekStart?: string;
  timeFormat?: string;
};

export function createPresenter(prefs: Preferences) {
  const {
    country = "en",
    scope = "GLOBAL",
    currency = "INR",
    dateFormat = "DD/MM/YYYY",
    numberFormat = "1,234.56",
    timezone = "UTC",
    measurementSystem = "metric",
    weekStart = "monday",
    timeFormat = "hh:mm A",
  } = prefs;

  /** 🔍 Parse number format like "1,234.56" or "1.234,56" */
  function parseNumberFormat(format: string) {
    const parts = format.match(/1(.+)234(.+)56/);
    if (!parts) return { group: ",", decimal: "." };
    return { group: parts[1], decimal: parts[2] };
  }

  const { group: groupSeparator, decimal: decimalSeparator } =
    parseNumberFormat(numberFormat);

  /** 📅 Format date using Moment + timezone */
  function formatDate(date: Date | string) {
    try {
      return moment.tz(date, timezone || "UTC").format(dateFormat);
    } catch {
      return moment(date).utc().format(dateFormat);
    }
  }

  /** 🕒 Format time using Moment + timezone */
  function formatTime(date: Date | string) {
    try {
      return moment.tz(date, timezone || "UTC").format(timeFormat);
    } catch {
      return moment(date).utc().format(timeFormat);
    }
  }

  /** 💰 Format currency based on locale and code */
  function formatCurrency(amount: number) {
    return new Intl.NumberFormat(country, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
    }).format(amount);
  }

  /** 🔢 Format number according to custom grouping/decimal pattern */
  function formatNumber(value: number) {
    const parts = value.toFixed(2).split(".");
    const intPart = parts[0];
    const fracPart = parts[1] || "00";

    const withGrouping = intPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      groupSeparator
    );
    return `${withGrouping}${decimalSeparator}${fracPart}`;
  }

  /** 📏 Convert between metric and imperial units */
  function convertMeasurement(
    value: number,
    type: "distance" | "weight" | "temperature"
  ): string {
    if (measurementSystem === "imperial") {
      switch (type) {
        case "distance":
          return `${(value * 0.621371).toFixed(2)} mi`;
        case "weight":
          return `${(value * 2.20462).toFixed(2)} lb`;
        case "temperature":
          return `${((value * 9) / 5 + 32).toFixed(1)} °F`;
      }
    }

    switch (type) {
      case "distance":
        return `${value.toFixed(2)} km`;
      case "weight":
        return `${value.toFixed(2)} kg`;
      case "temperature":
        return `${value.toFixed(1)} °C`;
    }
  }

  /** 📆 Get week start */
  function getWeekStart() {
    return weekStart;
  }

  /** 🌍 Get scope */
  function getScope() {
    return scope;
  }

  /** 🧭 Guess user timezone automatically */
  function guessUserZone() {
    return moment.tz.guess();
  }

  return {
    formatDate,
    formatTime,
    formatCurrency,
    formatNumber,
    convertMeasurement,
    getWeekStart,
    getScope,
    guessUserZone,
  };
}

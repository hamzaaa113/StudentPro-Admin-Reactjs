import type { Course } from "../types/institution.types";

/**
 * Formats a date string or Date object to a localized date string
 * @param date - The date to format
 * @returns Formatted date string (e.g., "January 1, 2024")
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a number as a currency string in USD
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Truncates text to a maximum length and adds ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if applicable
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * Mapping of country codes to full country names
 * Used for displaying human-readable country names from ISO codes
 */
export const COUNTRY_NAMES: Record<string, string> = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AR: "Argentina",
  AM: "Armenia",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BH: "Bahrain",
  BD: "Bangladesh",
  BY: "Belarus",
  BE: "Belgium",
  BN: "Brunei Darussalam",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BR: "Brazil",
  BG: "Bulgaria",
  KH: "Cambodia",
  CA: "Canada",
  KY: "Cayman Islands",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DO: "Dominican Republic",
  EG: "Egypt",
  EE: "Estonia",
  ET: "Ethiopia",
  FI: "Finland",
  FR: "France",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GR: "Greece",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JP: "Japan",
  GB: "United Kingdom",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KR: "Korea",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Lao People's Democratic Republic",
  LV: "Latvia",
  LB: "Lebanon",
  LY: "Libya",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Macao",
  MY: "Malaysia",
  MV: "Maldives",
  MX: "Mexico",
  MN: "Mongolia",
  MA: "Morocco",
  MM: "Myanmar",
  NP: "Nepal",
  NL: "Netherlands",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NG: "Nigeria",
  KP: "North Korea",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PS: "Palestine",
  PA: "Panama",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  QA: "Qatar",
  RO: "Romania",
  RU: "Russia",
  SA: "Saudi Arabia",
  RS: "Serbia",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  ZA: "South Africa",
  ES: "Spain",
  LK: "Sri Lanka",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syria",
  TW: "Taiwan Province of China",
  TJ: "Tajikistan",
  TH: "Thailand",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  UK: "United Kingdom",
  US: "United States",
  UZ: "Uzbekistan",
  VE: "Venezuela",
  VN: "Vietnam",
  YE: "Yemen",
};

/**
 * Converts a country code to its full country name
 * @param countryCode - The ISO country code (e.g., "US", "GB")
 * @returns Full country name or the original code if not found
 */
export const getCountryName = (countryCode: string): string => {
  return COUNTRY_NAMES[countryCode.toUpperCase()] || countryCode;
};

/**
 * Converts a country name to its ISO country code
 * @param countryName - The full country name (e.g., "United States", "United Kingdom")
 * @returns ISO country code or the original name if not found
 */
export const getCountryCode = (countryName: string): string => {
  const entry = Object.entries(COUNTRY_NAMES).find(
    ([, name]) => name.toLowerCase() === countryName.toLowerCase()
  );
  return entry ? entry[0] : countryName;
};

/**
 * Converts a country code to its flag emoji using Unicode Regional Indicator Symbols
 * Each flag is made from two Regional Indicator Symbol Letters (0x1F1E6-0x1F1FF)
 * @param countryCode - The ISO country code (e.g., "US", "GB", "AU")
 * @returns Flag emoji or empty string if invalid code
 */
export const getCountryFlag = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return "";

  const code = countryCode.toUpperCase();

  // Regional Indicator Symbol Letter A starts at 0x1F1E6
  // To convert 'A' (65) to 🇦 (0x1F1E6), we add 0x1F1A5 (127397)
  const OFFSET = 0x1F1A5;

  const firstChar = code.charCodeAt(0);
  const secondChar = code.charCodeAt(1);

  // Validate that both characters are A-Z
  if (firstChar < 65 || firstChar > 90 || secondChar < 65 || secondChar > 90) {
    return "";
  }

  // Generate flag emoji from two Regional Indicator Symbol codepoints
  return String.fromCodePoint(firstChar + OFFSET, secondChar + OFFSET);
};

/**
 * Gets display element for territory - flag emoji for country codes, world icon for "Global"
 * @param territory - Territory name or country code
 * @returns Object with flag emoji and display name
 */
export const getTerritoryDisplay = (territory: string): { flag: string; name: string; isGlobal: boolean } => {
  const upperTerritory = territory.toUpperCase().trim();

  // Check if it's "Global"
  if (upperTerritory === "GLOBAL" || territory.toLowerCase() === "global") {
    return {
      flag: "🌍",
      name: "Global",
      isGlobal: true
    };
  }

  // Check if it's a 2-letter country code
  if (upperTerritory.length === 2) {
    return {
      flag: getCountryFlag(upperTerritory),
      name: getCountryName(upperTerritory),
      isGlobal: false
    };
  }

  // It's a full country name, try to get its code and flag
  const code = getCountryCode(territory);
  if (code.length === 2) {
    return {
      flag: getCountryFlag(code),
      name: territory,
      isGlobal: false
    };
  }

  // Unknown territory, return as-is
  return {
    flag: "",
    name: territory,
    isGlobal: false
  };
};

/**
 * List of valid institution sectors
 * Used for validation and dropdown options
 */
export const INSTITUTION_SECTORS = [
  "University",
  "College",
  "Private School",
  "Government School",
  "English School",
  "Institute",
] as const;

/**
 * List of countries for institution filter dropdown
 * Ordered alphabetically for easy selection
 */
export const FILTER_COUNTRIES = [
  "Australia",
  "Canada",
  "China",
  "France",
  "Germany",
  "Hungary",
  "Indonesia",
  "Ireland",
  "Japan",
  "Malaysia",
  "Netherlands",
  "New Zealand",
  "Singapore",
  "Spain",
  "Switzerland",
  "Thailand",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
] as const;

/**
 * List of territories for institution filter dropdown
 * Includes global and specific country territories
 */
export const FILTER_TERRITORIES = [
  "Global",
  "Argentina",
  "Australia",
  "Bangladesh",
  "Bhutan",
  "Brazil",
  "Brunei Darussalam",
  "Cambodia",
  "Canada",
  "Cayman Islands",
  "China",
  "Colombia",
  "France",
  "Germany",
  "Ghana",
  "Hong Kong",
  "India",
  "Indonesia",
  "Japan",
  "Kenya",
  "Korea",
  "Kuwait",
  "Lao People's Democratic Republic",
  "Macao",
  "Malaysia",
  "Mongolia",
  "Myanmar",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Nigeria",
  "Pakistan",
  "Philippines",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "Sri Lanka",
  "Taiwan Province of China",
  "Thailand",
  "Uganda",
  "United Arab Emirates",
  "United States",
  "Vietnam",
] as const;

/**
 * Mapping of countries to their states/provinces/territories
 * Used for dynamic state filtering based on selected country
 */
export const COUNTRY_STATES: Record<string, string[]> = {
  "Australia": [
    "New South Wales",
    "Victoria",
    "Queensland",
    "South Australia",
    "Western Australia",
    "Tasmania",
    "Northern Territory",
    "Australian Capital Territory"
  ],
  "Canada": [
    "Alberta",
    "Alberta, Calgary",
    "British Columbia",
    "British Columbia, Burnaby",
    "British Columbia, Kamloops",
    "British Columbia, Shawnigan Lake",
    "British Columbia, Vancouver",
    "British Columbia, Victoria",
    "Manitoba",
    "Manitoba, Winnipeg",
    "Montreal",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nova Scotia, Sydney",
    "Nunavut",
    "Ontario",
    "Ontario, Belleville",
    "Ontario, Brampton",
    "Ontario, Peterborough",
    "Ontario, St. Catharines",
    "Ontario, Thunder Bay",
    "Ontario, Toronto",
    "Ontario, Waterloo",
    "Ontario, Windsor",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Saskatchewan (Moose Jaw, Prince Albert, Regina, Saskatoon)",
    "Saskatchewan, Regina",
    "Toronto",
    "Vancouver",
    "Yukon"
  ],
  "United States": [
    "Alabama",
    "Alabama, Auburn",
    "Alabama, Birmingham",
    "Alabama, Montgomery",
    "Alaska",
    "ALL",
    "Arizona",
    "Arizona, Tempe",
    "Arizona, Tucson",
    "Arkansas",
    "Boston",
    "California",
    "California, Bakersfield",
    "California, Fresno",
    "California, Kentfield, Santa Monica, Irvine, San Mateo",
    "California, Los Angeles",
    "California, Malibu",
    "California, Pasadena",
    "California, Saint-Anselmo North of San Francisco",
    "California, San Francisco",
    "California, Santa Barbara",
    "California, Stockton",
    "Colorado",
    "Colorado, Denver",
    "Colorado, Fort Collins",
    "Connecticut",
    "Connecticut, Hamden",
    "Connecticut, New Haven",
    "Connecticut, Simsbury",
    "Connecticut, Storrs",
    "Delaware",
    "Florida",
    "Florida, Jacksonville",
    "Florida, Miami",
    "Florida, Orlando",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Illinois, Carbondale",
    "Illinois, Chicago",
    "Illinois, Decatur",
    "Illinois, Normal",
    "Illinois, Peoria",
    "Indiana",
    "Indiana, Angola",
    "Iowa",
    "Iowa, Des Moines",
    "Kansas",
    "Kansas, Lawrence",
    "Kansas State, Lawrence",
    "Kentucky",
    "Louisiana",
    "Louisiana, Baton Rouge",
    "Louisiana, New Orleans",
    "Maine",
    "Maryland",
    "Maryland, Baltimore",
    "Maryland, Colora",
    "Massachusetts",
    "Massachusetts, Boston",
    "Massachusetts, North Andover",
    "Michigan",
    "Minnesota",
    "Minnesota, Minneapolis",
    "Mississippi",
    "Missouri",
    "Missouri, St. Louis",
    "Montana",
    "Nebraska",
    "Nebraska, Omaha",
    "Nevada",
    "New Hampshire",
    "New Hampshire, Concord",
    "New Hampshire, Henniker and Manchester",
    "New Hampshire, Portsmouth",
    "New Jersey",
    "New Jersey, Camden",
    "New Jersey, Madison",
    "New Jersey, New Brunswick",
    "New Mexico",
    "New York",
    "New York, Brookville",
    "New York, Brooklyn",
    "New York, Buffalo",
    "New York, Greenvale",
    "New York, Hempstead",
    "New York, Long Island",
    "New York, New York",
    "New York, Queens",
    "New York, Stony Brook",
    "New York State, New York City",
    "New York State, Rochester",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Ohio, Cleveland",
    "Ohio, Dayton",
    "Ohio, Kent",
    "Oklahoma",
    "Oklahoma, Tulsa",
    "Oregon",
    "Oregon, Corvallis",
    "Oregon, Portland",
    "Pennsylvania",
    "Pennsylvania, Chester",
    "Pennsylvania, Philadelphia",
    "Pennsylvania, Pittsburgh",
    "Philadelphia, Villanova",
    "Rhode Island",
    "South Carolina",
    "South Carolina, Columbia",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Texas, Christi",
    "Texas, Georgetown",
    "Texas, San Antonio",
    "Texas, Waco",
    "Utah",
    "Utah, Salt Lake City",
    "Vermont",
    "Vermont, Burlington",
    "Virginia",
    "Virginia, Charlottesville",
    "Virginia, Fairfax",
    "Virginia, Harrisonburg",
    "Virginia, Richmond",
    "Virginia, Woodstock",
    "Washington",
    "Washington, D.C",
    "Washington, D.C.",
    "Washington, Shoreline",
    "Washington, Spokane",
    "West Virginia",
    "West Virginia, Huntington",
    "Wisconsin",
    "Wisconsin, Eau Claire",
    "Wisconsin, Green Bay",
    "Wisconsin, Madison",
    "Wisconsin, Platteville",
    "Wisconsin, River Falls",
    "Wisconsin, Stevens Point",
    "Wisconsin, Superior",
    "Wisconsin, Whitewater",
    "Wyoming",
    "Wyoming, Laramie"
  ],
  "United Kingdom": [
    "Aberdeen",
    "Aberystwyth",
    "All",
    "Banbury",
    "Bangor",
    "Bath",
    "Belfast",
    "Birmingham",
    "Bolton",
    "Bournemouth",
    "Bradford",
    "Brighton",
    "Bristol",
    "Buckingham",
    "Cambridge",
    "Cambridge & London",
    "Cannock",
    "Canterbury",
    "Cardiff",
    "Carlisle",
    "Cheltenham",
    "Chester",
    "Chichester",
    "Colchester",
    "Coleraine",
    "Coventry",
    "Cranfield",
    "Derby",
    "Dundee",
    "Durham",
    "Edinburgh",
    "Egham",
    "Ellesmere",
    "Elstree",
    "Ely",
    "England",
    "Exeter",
    "Falmouth",
    "Farnham",
    "Folkestone",
    "Glasgow",
    "Greater Manchester",
    "Guildford",
    "Harrogate",
    "Hatfield",
    "Huddersfield",
    "Hull",
    "Keele",
    "Lancaster",
    "Leeds",
    "Leicester",
    "Lincoln",
    "Liverpool",
    "Llanelli",
    "London",
    "Loughborough",
    "Luton",
    "Malvern",
    "Manchester",
    "Middlesbrough",
    "Newcastle",
    "Newcastle upon Tyne",
    "Northern Ireland",
    "Northampton",
    "Norwich",
    "Nottingham",
    "Oakham",
    "Ormskirk",
    "Oswestry",
    "Oxford",
    "Pangbourne",
    "Perth",
    "Petworth",
    "Plymouth",
    "Pontypridd",
    "Poole",
    "Portsmouth",
    "Preston",
    "Reading",
    "Rochester",
    "Salisbury",
    "Scotland",
    "Scunthorpe",
    "Sheffield",
    "Southampton",
    "Spinkhill",
    "St Andrews",
    "Stirling",
    "Sunderland",
    "Surrey",
    "Sussex",
    "Swansea",
    "Taunton",
    "Truro",
    "Uttoxeter",
    "Wales",
    "Woldingham",
    "Wolverhampton",
    "Woodbridge",
    "Worksop",
    "Wycombe",
    "York"
  ],
  "Germany": [
    "Leipzig"
  ],
  "India": [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
  ],
  "China": [
    "Suzhou, Jiangsu", "Ningbo, Zhejiang", "Hangzhou, Zheijiang"
  ],
  "Malaysia": [
    "Johor",
    "Johor Bahru",
    "Kedah",
    "Kelantan",
    "Kuala Lumpur",
    "Kuala Lumpur, Springhill (Port Dickson), Kuching",
    "Labuan",
    "Malacca",
    "Negeri Sembilan",
    "Nilai",
    "Pahang",
    "Penang",
    "Penang Island",
    "Perak",
    "Perlis",
    "Putrajaya",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Semenyih",
    "Subang",
    "Terengganu"
  ],
  "Indonesia": [
    "West Jakarta", "Jakarta", "Bandung"
  ],
  "Japan": [
    "kyoto"
  ],
  "France": [
    "Paris",
    "Yssingeaux",
    "Lyon",
    "Saint-Étienne",
    "Shanghai",
    "Casablanca"
  ],
  "Spain": [

    "Murcia", "Marbella"
  ],
  "Netherlands": [
    "Hague", "Amsterdam"
  ],
  "New Zealand": [
    "Auckland",
    "Auckland, Henderson",
    "Auckland, Wellington",
    "Auckland, Greymouth",
    "Blenheim",
    "Christchurch",
    "Cromwell",
    "Dunedin",
    "Gisborne",
    "Gore",
    "Hamilton",
    "Hastings",
    "Invercargill",
    "Napier",
    "Nelson",
    "New Plymouth",
    "Otanomomo",
    "Palmerston North",
    "Palmerston North, Whanganui, Masterton and Levin",
    "Queenstown",
    "Rotorua",
    "Tauranga",
    "Wellington",
    "Whangarei"
  ],
  "Switzerland": [
    "Le Bouveret", "Lucerne", "Brig", "Montreux", "Glion", "Bulle", "Caux", "Leysin", "Soerenberg", "Valais"

  ],
  "Ireland": [
    "Dublin", "Cork", "Co. Kildare", "Limerick", "Galway"
  ],
  "Thailand": [
    "Bangkok", "Pathum Thani"
  ],
  "Vietnam": [
    "Hanoi", "Ho Chi Minh City", "Da Nang"
  ],
  "United Arab Emirates": [

    "Dubai",

  ],
  "Singapore": ["Singapore"],
  "Hungary": [
    "Pécs"

  ]
};

/**
 * List of institution groups for filter dropdown
 * Educational institution partnerships and networks
 */
export const FILTER_GROUPS = [
  "Academies Australasia",
  "Acknowledge Education",
  "ASC International",
  "ATMC",
  "Australasia",
  "CEG",
  "ECA",
  "Government TAFE",
  "Greenwich College",
  "Group of Eight",
  "INTO",
  "Kaplan",
  "Navitas",
  "OIEG",
  "QA Higher Education",
  "SEG",
  "Shorelight",
  "Study Group",
  "Sommet",
  "Torrens University Australia",
  "UP Education",
  "University Bridge",
] as const;

/**
 * Promoted filter options (for promoted field: Global/All)
 */
export const FILTER_PROMOTIONS = ["Global", "All"] as const;

/**
 * Boolean filter options (Yes/No)
 */
export const FILTER_YES_NO = ["Yes", "No"] as const;

/**
 * Page size options for pagination
 */
export const PAGE_SIZE_OPTIONS = [10, 15, 20, 25, 50, 100] as const;

/**
 * Validates if a file is a valid Excel file
 * Checks file type and size constraints * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in megabytes (default: 5MB)
 * @returns Object containing validation result and error message if invalid
 */
export const validateExcelFile = (
  file: File | null | undefined,
  maxSizeMB: number = 5
): { isValid: boolean; error?: string } => {
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  const validTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  const isValidType =
    validTypes.includes(file.type) ||
    file.name.endsWith(".xlsx") ||
    file.name.endsWith(".xls");

  if (!isValidType) {
    return { isValid: false, error: "Please select a valid XLSX file" };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  return { isValid: true };
};

/**
 * Formats file size in bytes to a human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB", "500 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Parses a course string that has the commission at the end
 * Handles formats like:
 * - "MBA 10%"
 * - "Foundation, International Year One & Pre-Masters 20%"
 * - "UG Direct Entry (1st year only) 20% (For students from Brunei...); others 15%"
 * @param courseString - The full course string with commission at the end
 * @returns Object with course name and commission, or null if parsing fails
 */
export const parseCourseString = (
  courseString: string
): { course: string; commission: string } | null => {
  if (!courseString || !courseString.trim()) {
    return null;
  }

  const trimmed = courseString.trim();

  // Try to find percentage pattern: number followed by %
  // Match patterns like "20%", "15%", "10.5%" etc.
  const percentageRegex = /(\d+(?:\.\d+)?)%/g;
  const matches = [...trimmed.matchAll(percentageRegex)];

  if (matches.length === 0) {
    // No percentage found, return the whole string as course name with empty commission
    return { course: trimmed, commission: "" };
  }

  // Handle cases with multiple percentages (e.g., "20%; others 15%")
  // We'll extract all percentages and join them
  const lastMatch = matches[matches.length - 1];
  const lastPercentageIndex = lastMatch.index!;

  // Get everything before the last percentage as the course name
  let courseName = trimmed.substring(0, lastPercentageIndex).trim();

  // Get the commission part (from last percentage to end)
  let commissionPart = trimmed.substring(lastPercentageIndex).trim();

  // If there are multiple percentages, include them all in commission
  // Example: "20% (conditions); others 15%" -> commission = "20%; others 15%"
  if (matches.length > 1) {
    // Find the first percentage in the string
    const firstMatch = matches[0];
    const firstPercentageIndex = firstMatch.index!;

    // Check if there's descriptive text after the first percentage
    // If yes, we need to keep it as part of commission
    const afterFirstPercentage = trimmed.substring(firstPercentageIndex);

    // Look for patterns like "20% (condition); others 15%"
    if (afterFirstPercentage.includes(";") || afterFirstPercentage.includes("others")) {
      courseName = trimmed.substring(0, firstPercentageIndex).trim();
      commissionPart = afterFirstPercentage.trim();
    }
  }

  // Clean up course name - remove trailing commas, semicolons, etc.
  courseName = courseName.replace(/[;,]\s*$/, "").trim();

  return {
    course: courseName,
    commission: commissionPart
  };
};

/**
 * Validates a course entry before adding to the list
 * @param course - Course name
 * @param commission - Commission value
 * @returns Object containing validation result and error message if invalid
 */
export const validateCourse = (
  course: string,
  commission: string
): { isValid: boolean; error?: string } => {
  if (!course.trim()) {
    return { isValid: false, error: "Course name is required" };
  }

  if (!commission.trim()) {
    return { isValid: false, error: "Commission is required" };
  }

  return { isValid: true };
};

/**
 * Removes a course from the course list by index
 * @param courses - Array of courses
 * @param index - Index of the course to remove
 * @returns New array without the specified course
 */
export const removeCourseByIndex = (courses: Course[], index: number): Course[] => {
  return courses.filter((_, i) => i !== index);
};

/**
 * Adds a new course to the course list
 * @param courses - Existing array of courses
 * @param newCourse - New course to add
 * @returns New array with the added course
 */
export const addCourseToList = (courses: Course[], newCourse: Course): Course[] => {
  return [...courses, newCourse];
};

/**
 * Converts filter state to boolean or undefined for API queries
 * @param value - Filter value as string ("true", "false", or empty)
 * @returns Boolean value or undefined if empty
 */
export const parseBooleanFilter = (value: string): boolean | undefined => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

/**
 * Resets a file input element's value
 * @param fileInputRef - Reference to the file input element
 */
export const resetFileInput = (fileInputRef: React.RefObject<HTMLInputElement | null>): void => {
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

/**
 * Generates pagination range for display
 * @param currentPage - Current active page
 * @param totalPages - Total number of pages
 * @param delta - Number of pages to show before and after current page (default: 2)
 * @returns Array of page numbers to display
 */
export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  delta: number = 2
): number[] => {
  const range: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (Math.abs(i - currentPage) <= delta) {
      range.push(i);
    }
  }

  return range;
};

/**
 * Checks if pagination should show ellipsis before last page
 * @param currentPage - Current active page
 * @param totalPages - Total number of pages
 * @param delta - Number of pages to show before and after current page (default: 2)
 * @returns True if ellipsis should be shown
 */
export const shouldShowEndEllipsis = (
  currentPage: number,
  totalPages: number,
  delta: number = 2
): boolean => {
  return currentPage < totalPages - delta;
};

/**
 * Checks if pagination should show ellipsis after first page
 * @param currentPage - Current active page
 * @param delta - Number of pages to show before and after current page (default: 2)
 * @returns True if ellipsis should be shown
 */
export const shouldShowStartEllipsis = (
  currentPage: number,
  delta: number = 2
): boolean => {
  return currentPage > delta + 1;
};

/**
 * Removes MongoDB-specific fields from an object or array of objects
 * Useful for sanitizing data before export
 * @param data - Object or array of objects to sanitize
 * @param fieldsToRemove - Array of field names to remove (default: ['_id', '__v'])
 * @returns Sanitized data without specified fields
 */
export const sanitizeForExport = <T extends Record<string, unknown>>(
  data: T | T[],
  fieldsToRemove: string[] = ['_id', '__v']
): Partial<T> | Partial<T>[] => {
  const removeFields = (obj: T): Partial<T> => {
    const sanitized = { ...obj };
    fieldsToRemove.forEach(field => {
      delete sanitized[field];
    });
    return sanitized;
  };

  if (Array.isArray(data)) {
    return data.map(item => removeFields(item));
  }
  return removeFields(data);
};

/**
 * Cleans filter object by removing empty strings and undefined values
 * @param filters - Object containing filter values
 * @returns Cleaned filter object with only non-empty values
 */
export const cleanFilters = (filters: Record<string, unknown>): Record<string, unknown> => {
  const cleaned: Record<string, unknown> = {};

  Object.keys(filters).forEach(key => {
    const value = filters[key];
    // Keep the value if it's not undefined, not null, and not an empty string
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

/**
 * Converts territory filter value to appropriate format for API
 * Keeps "Global" as-is, converts other territory names to country codes
 * @param territory - Territory name or code
 * @returns Formatted territory value for API
 */
export const formatTerritoryFilter = (territory: string): string => {
  if (!territory) return "";

  if (territory.toUpperCase() === "GLOBAL") {
    return "Global";
  }

  return getCountryCode(territory);
};

/**
 * Builds clean institution filters object from raw filter state
 * Handles territory and country code conversions automatically
 * @param filters - Raw filter values from state
 * @returns Clean filters object ready for API
 */
export const buildInstitutionFilters = (filters: {
  searchName?: string;
  filterCountry?: string;
  filterState?: string;
  filterTerritory?: string;
  filterSector?: string;
  filterGroup?: string;
  filterPromoted?: string;
  filterScholarship?: string;
  filter100Promotion?: string;
  pageSize?: number;
}): Record<string, unknown> => {
  const cleanFilters: Record<string, unknown> = {};

  if (filters.pageSize) cleanFilters.pageSize = filters.pageSize;
  if (filters.searchName?.trim()) cleanFilters.name = filters.searchName.trim();
  if (filters.filterCountry) cleanFilters.country = getCountryCode(filters.filterCountry);
  if (filters.filterState?.trim()) cleanFilters.state = filters.filterState.trim();
  if (filters.filterTerritory) cleanFilters.territory = formatTerritoryFilter(filters.filterTerritory);
  if (filters.filterSector) cleanFilters.sector = filters.filterSector;
  if (filters.filterGroup) cleanFilters.group = filters.filterGroup;
  if (filters.filterPromoted) cleanFilters.promoted = filters.filterPromoted;
  if (filters.filterScholarship) cleanFilters.scholarship = filters.filterScholarship;
  if (filters.filter100Promotion) cleanFilters.hundredPercentPromotion = filters.filter100Promotion;

  return cleanFilters;
};

/**
 * Builds export filters from filter state (subset of institution filters)
 * @param filters - Raw filter values from state
 * @returns Clean export filters object ready for API
 */
export const buildExportFilters = (filters: {
  searchName?: string;
  filterCountry?: string;
  filterState?: string;
  filterTerritory?: string;
  filterSector?: string;
  filterGroup?: string;
  filterPromoted?: string;
  filterScholarship?: string;
}): Record<string, unknown> => {
  const cleanFilters: Record<string, unknown> = {};

  if (filters.searchName?.trim()) cleanFilters.name = filters.searchName.trim();
  if (filters.filterCountry) cleanFilters.country = getCountryCode(filters.filterCountry);
  if (filters.filterState?.trim()) cleanFilters.state = filters.filterState.trim();
  if (filters.filterTerritory) cleanFilters.territory = formatTerritoryFilter(filters.filterTerritory);
  if (filters.filterSector) cleanFilters.sector = filters.filterSector;
  if (filters.filterGroup) cleanFilters.group = filters.filterGroup;
  if (filters.filterPromoted) cleanFilters.promoted = filters.filterPromoted;
  if (filters.filterScholarship) cleanFilters.scholarship = filters.filterScholarship;

  return cleanFilters;
};

/**
 * Creates a debounced function that delays execution until after a specified wait time
 * @param func - Function to debounce
 * @param wait - Milliseconds to wait before executing (default: 300ms)
 * @returns Debounced function with cancel method
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = 300
): ((...args: Parameters<T>) => void) & { cancel: () => void } => {
  let timeout: number | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};
export const parseStateField = (state: string | string[]): string => {
  if (!state) return "";

  let items: string[] = [];

  if (Array.isArray(state)) {
    items = state;
  } else if (typeof state === 'string') {
    // Try JSON parse first
    try {
      const parsed = JSON.parse(state);
      if (Array.isArray(parsed)) {
        items = parsed;
      } else {
        items = [state];
      }
    } catch {
      // If not JSON, split by comma
      items = state.split(',');
    }
  }

  // Clean up items
  const cleanedItems = items.flatMap(item => {
    if (typeof item !== 'string') return String(item);

    // Remove brackets, then split by comma (handles cases where an array element contains multiple values)
    // Then remove quotes and trim
    return item.replace(/[\[\]]/g, "")
      .split(',')
      .map(s => s.replace(/['"]+/g, "").trim())
      .filter(s => s.length > 0);
  });

  return [...new Set(cleanedItems)].join(", ");
};


/**
 * Renders territory display element - returns flag emoji for countries, globe icon indicator for Global
 * @param territory - Territory string (country code or "Global")
 * @returns Object with display properties
 */
export const renderTerritoryBadge = (territory: string): {
  isGlobal: boolean;
  displayText: string;
  countryCode: string;
  flag: string;
} => {
  const trimmed = territory?.trim() || "";

  if (!trimmed) {
    return { isGlobal: false, displayText: "", countryCode: "", flag: "" };
  }

  const isGlobal = trimmed.toUpperCase() === "GLOBAL" || trimmed.toLowerCase() === "global";

  if (isGlobal) {
    return {
      isGlobal: true,
      displayText: "Global",
      countryCode: "",
      flag: "🌐",
    };
  }

  // Try to resolve to a code if it's a full name
  let code = trimmed;
  if (code.length > 2) {
    code = getCountryCode(code);
  }
  code = code.toUpperCase();

  // Handle UK special case - map to GB for correct flag rendering
  if (code === 'UK') {
    code = 'GB';
  }

  return {
    isGlobal: false,
    displayText: code,
    countryCode: code,
    flag: getCountryFlag(code),
  };
};

/**
 * Counts total courses from institution course field (handles multi-line courses)
 * @param courses - Array of course objects
 * @returns Total number of courses after parsing
 */
export const countTotalCourses = (courses: { course: string; commission: string }[]): number => {
  if (!courses || courses.length === 0) return 0;

  return courses.reduce((total, course) => {
    const courseText = course.course || '';
    const lines = courseText.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);

    // If multiple lines or no commission, each line is a separate course
    if (lines.length > 1 || !course.commission?.trim()) {
      return total + lines.length;
    }

    return total + 1;
  }, 0);
};

/**
 * Formats course data for display in view modal
 * Handles both single courses and multi-line course entries
 * @param courses - Array of course objects
 * @returns Flattened array of course display objects
 */
export const formatCoursesForDisplay = (
  courses: { course: string; commission: string }[]
): Array<{ course: string; commission: string; key: string }> => {
  if (!courses || courses.length === 0) return [];

  return courses.flatMap((course, idx) => {
    const courseText = course.course || '';
    const courseLines = courseText
      .split(/\n+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // If multiple lines or no commission, parse each line
    if (courseLines.length > 1 || !course.commission || !course.commission.trim()) {
      return courseLines.map((line, lineIdx) => {
        const parsed = parseCourseString(line);
        const displayCourse = parsed || { course: line, commission: '' };

        return {
          course: displayCourse.course,
          commission: displayCourse.commission || 'N/A',
          key: `${idx}-${lineIdx}`,
        };
      });
    }

    // Single course with commission
    return [{
      course: course.course,
      commission: course.commission || 'N/A',
      key: `${idx}`,
    }];
  });
};

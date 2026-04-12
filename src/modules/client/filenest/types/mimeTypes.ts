export const MEDICAL_RECORD_MIME_TYPES: string[] = [
  // =========================
  // Core Medical Documents
  // =========================
  "application/pdf", // prescriptions, discharge summaries
  "text/plain", // clinical notes
  "application/rtf", // legacy EHR exports
  "text/markdown",

  // =========================
  // DICOM (Medical Imaging)
  // =========================
  "application/dicom",
  "application/dicom+json",
  "application/dicom+xml",
  "application/octet-stream", // VERY common for .dcm uploads

  // =========================
  // Medical Images (Scans)
  // =========================
  "image/jpeg", // X-ray photos, reports
  "image/png",
  "image/tiff", // pathology, radiology
  "image/bmp",
  "image/webp",
  "image/heic",
  "image/heif",

  // =========================
  // Lab & Structured Medical Data
  // =========================
  "application/json", // FHIR bundles, lab APIs
  "application/xml", // HL7 XML
  "text/xml",
  "application/hl7-v2", // HL7 v2 messages (if supported)
  "application/fhir+json",
  "application/fhir+xml",

  // =========================
  // Office Docs (Still Common)
  // =========================
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // =========================
  // Archives (Medical Bundles)
  // =========================
  "application/zip", // multiple reports zipped
  "application/x-tar",
  "application/gzip",

  // =========================
  // Scanned & Faxed Records
  // =========================
  "image/jp2", // JPEG 2000 (used in PACS)
  "image/x-portable-pixmap",

  // =========================
  // Catch-all (Hospitals love this)
  // =========================
  "application/octet-stream",
];

export const MEDICAL_MIME_TYPES = {
  documents: [
    "application/pdf",
    "text/plain",
    "application/rtf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],

  dicom: [
    "application/dicom",
    "application/dicom+json",
    "application/dicom+xml",
    "application/octet-stream",
  ],

  images: [
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/heic",
    "image/heif",
    "image/jp2",
  ],

  structuredData: [
    "application/json",
    "application/xml",
    "text/xml",
    "application/fhir+json",
    "application/fhir+xml",
    "application/hl7-v2",
  ],

  archives: ["application/zip", "application/x-tar", "application/gzip"],
} as const;

export const MEDICAL_MIME_FILTER_TYPES: string[] = [
  "image", // all images
  "video", // all videos
  "application/pdf", // reports, prescriptions, discharge summaries
  "image/jpeg", // scans, photos
  "image/png",
  "image/tiff", // radiology, pathology
  "application/dicom", // DICOM (some browsers)
  "application/octet-stream", // DICOM & hospital uploads
  "text/plain", // clinical notes
  "application/json", // structured lab / FHIR data
];

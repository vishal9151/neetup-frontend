export const NEETUP_LOGO = "https://video-on-demand-lively.s3.ap-south-1.amazonaws.com/ai_generated/gemini_pro_1K/1x1/images/1767044181199_1976_0.jpeg";
export const BRAND_NAME = "NEETUP"
export const Primary_Color = "#333333";
export const Base_Url = "https://neetup-backend.onrender.com"
export const uniqueId = () => {
  return Math.random().toString(36).substring(2, 10);
};
export const openSameUrlWithJobId = (jobId: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set("jobId", jobId);
  window.open(url.toString(), "_self");
};

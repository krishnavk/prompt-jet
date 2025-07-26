export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("Content copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy: ", err);
    alert("Failed to copy content");
  }
};
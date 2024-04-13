import fetch from "node-fetch";
// import SummarizerManager from "node-summarizer/src/SummarizerManager.js";
// import * as cheerio from "cheerio";
// // sk - tLNvV11GOiZw3OBh5CPiT3BlbkFJMfJRo9xXtpbB9N8Dx3cD;
// // sk - wWxugOwo9Ze5RPaaZpSTT3BlbkFJh3prjghtv0u1dDL4LIUn;
// async function summarizeArticle(articleUrl) {
//   try {
//     // Fetch article content (replace with your actual fetching mechanism)
//     const response = await fetch(articleUrl);
//     // console.log("response: ", response);
//     const html = await response.text();
//     // console.log("html: ", html);
//     // Use cheerio to extract the article title and text
//     const $ = cheerio.load(html);
//     const title = $("head title").text();
//     const paragraphs = $("p")
//       .toArray()
//       .map((p) => $(p).text())
//       .join("\n");
//     console.log("title: ", title);
//     console.log("para: ", paragraphs);

//     console.log("Original Article (excerpt):");
//     console.log(articleText.substring(0, 100) + "rest of text..."); // Show first 100 characters (adjust as needed)
//     console.log("\nSummary:");
//     // console.log(summary);
//   } catch (error) {
//     console.error("Error fetching or summarizing article:", error);
//   }
// }

// // Replace this with your HTML parsing logic to extract text content
// function extractTextFromHtml(htmlContent) {
//   // Implement logic using a library like cheerio to remove HTML tags and extract text
//   // This is a placeholder for demonstration purposes
//   return htmlContent.replace(/<[^>]*>/g, " "); // Simple replacement (improve for real use)
// }

// // Example usage
// export default summarizeArticle;
const createSummary = async () => {
  const url =
    "https://contentai-net-text-generation.p.rapidapi.com/v1/text/blog-articles?category=health-and-medicine";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "11bc3f3af2msh96647404de321a5p1a8f34jsne18d0bbf38d3",
      "X-RapidAPI-Host": "contentai-net-text-generation.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

export default createSummary;

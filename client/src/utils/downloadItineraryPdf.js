import { formatDate } from "./formatDate";

const downloadItineraryPdf = async (itinerary) => {
  try {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    let y = 20;
    const pageH = doc.internal.pageSize.height;
    const margin = 15;

    const addPage = () => {
      doc.addPage();
      y = 20;
    };

    const checkPage = (needed = 10) => {
      if (y + needed > pageH - margin) addPage();
    };

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text(itinerary.title || "Travel Itinerary", margin, y);
    y += 10;

    // Summary
    if (itinerary.summary) {
      checkPage(20);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      const summaryLines = doc.splitTextToSize(itinerary.summary, 180);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 6 + 5;
    }

    // Trip Info
    checkPage(30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Trip Details", margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Destination: ${itinerary.destination || "N/A"}`, margin, y); y += 6;
    doc.text(`From: ${itinerary.source || "N/A"} → ${itinerary.destination || "N/A"}`, margin, y); y += 6;
    doc.text(`Dates: ${formatDate(itinerary.departureDate)} - ${formatDate(itinerary.returnDate)}`, margin, y); y += 6;
    y += 5;

    // Days
    (itinerary.days || []).forEach((day) => {
      checkPage(25);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text(`Day ${day.day}: ${day.title || ""}`, margin, y);
      y += 7;

      (day.activities || []).forEach((act) => {
        checkPage(15);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text(`${act.time || ""} - ${act.activity}`, margin + 5, y);
        y += 5;
        if (act.description) {
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          const lines = doc.splitTextToSize(act.description, 170);
          doc.text(lines, margin + 10, y);
          y += lines.length * 5 + 2;
        }
      });
      y += 5;
    });

    // Tips
    if (itinerary.travelTips?.length) {
      checkPage(20);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Travel Tips", margin, y); y += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      itinerary.travelTips.forEach((tip) => {
        checkPage(8);
        const lines = doc.splitTextToSize(`• ${tip}`, 175);
        doc.text(lines, margin, y);
        y += lines.length * 5 + 2;
      });
    }

    doc.save(`${itinerary.title || "itinerary"}.pdf`);
    return true;
  } catch (err) {
    console.error("PDF download error:", err);
    // Fallback: open print dialog
    window.print();
    return false;
  }
};

export default downloadItineraryPdf;

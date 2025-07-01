'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { type Student } from '@/lib/mock-data';

export async function generatePdfReport(student: Student, elementId: string): Promise<Blob> {
    const reportElement = document.getElementById(elementId);
    if (!reportElement) {
      throw new Error('Report element not found');
    }

    const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff', // Set a solid background for canvas to avoid transparency issues
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pdfWidth - margin * 2;

    // Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.text('Attendance Report', pdfWidth / 2, margin + 5, { align: 'center' });
    
    // Add a line under header
    pdf.setLineWidth(0.5);
    pdf.line(margin, margin + 10, pdfWidth - margin, margin + 10);

    // Student Details
    const studentDetailsY = margin + 22;
    pdf.setFontSize(12);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Student Name:`, margin, studentDetailsY);
    pdf.setFont('helvetica', 'bold');
    pdf.text(student.name, margin + 35, studentDetailsY);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Roll Number:`, margin, studentDetailsY + 8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(student.rollNumber, margin + 35, studentDetailsY + 8);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Department:`, margin, studentDetailsY + 16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${student.department} - ${student.year}`, margin + 35, studentDetailsY + 16);

    pdf.setFont('helvetica', 'normal');
    pdf.text(`Report Date:`, pdfWidth - margin - 50, studentDetailsY);
    pdf.setFont('helvetica', 'bold');
    pdf.text(new Date().toLocaleDateString(), pdfWidth - margin, studentDetailsY, { align: 'right' });


    // Add captured image
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
    const imageStartY = studentDetailsY + 26;

    // This handles basic pagination if the image is too tall
    let heightLeft = imgHeight;
    let position = imageStartY;

    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
    heightLeft -= (pdfHeight - position - margin);

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Footer
    const pageCount = pdf.internal.pages.length;
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
            `Page ${i} of ${pageCount}`,
            pdfWidth / 2,
            pdfHeight - 10,
            { align: 'center' }
        );
        pdf.text(
            'AttendEase - Merit Haji Ismail Sahib Arts and Science College',
            margin,
            pdfHeight - 10
        );
    }
    
    return pdf.output('blob');
}

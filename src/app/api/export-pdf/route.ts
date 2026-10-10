import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function POST(req: NextRequest) {
    try {
        let { result, image, date, reportId } = await req.json();

        // Clean result: Replace Rupee symbol with INR to avoid rendering issues in standard PDF fonts
        result = result.replace(/₹/g, 'INR ');
        result = result.replace(/\*\*/g, '');

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // --- Helper: Draw Section Header ---
        const drawSectionHeader = (title: string, y: number) => {
            doc.setFillColor(249, 250, 251); // gray-50
            doc.rect(margin, y, contentWidth, 10, 'F');
            doc.setDrawColor(229, 231, 235); // gray-200
            doc.line(margin, y, margin + contentWidth, y);
            doc.line(margin, y + 10, margin + contentWidth, y + 10);

            doc.setTextColor(156, 163, 175); // gray-400
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.text(title.toUpperCase(), margin + 5, y + 6.5, { charSpace: 1 });
            return y + 18;
        };

        // --- Header Section ---
        // Black Box with Logo
        doc.setFillColor(24, 24, 27); // #18181b
        doc.roundedRect(margin, 15, 18, 18, 3, 3, 'F');

        // Text "P" inside the black box
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('G', margin + 9, 27, { align: 'center' });

        // Brand Name
        doc.setTextColor(24, 24, 27);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Gem', margin + 24, 24);

        doc.setTextColor(15, 92, 74); // #0f5c4a
        doc.text('Sight', margin + 24 + doc.getTextWidth('Gem'), 24);

        doc.setTextColor(161, 161, 170); // #a1a1aa
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('AI JEWELLERY APPRAISAL', margin + 24, 30, { charSpace: 1.5 });

        // Report Info (Right side)
        doc.setTextColor(161, 161, 170);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('REPORT STATUS', pageWidth - margin, 18, { align: 'right' });

        doc.setTextColor(22, 163, 74); // #16a34a
        doc.setFontSize(11);
        doc.text('VERIFIED ANALYSIS', pageWidth - margin, 24, { align: 'right' });

        doc.setTextColor(161, 161, 170);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`ID: ${reportId}`, pageWidth - margin, 30, { align: 'right' });

        doc.setDrawColor(244, 244, 245); // #f4f4f5
        doc.line(margin, 40, pageWidth - margin, 40);

        let currentY = 50;

        // --- Subject Evidence Section ---
        currentY = drawSectionHeader('Subject Evidence', currentY);

        if (image) {
            try {
                doc.setDrawColor(243, 244, 246);
                doc.rect(margin, currentY, 80, 80);
                doc.addImage(image, 'JPEG', margin + 2, currentY + 2, 76, 76);
            } catch (e) {
                doc.rect(margin, currentY, 80, 80);
                doc.text('Image Error', margin + 40, currentY + 40, { align: 'center' });
            }
        }

        // Appraisal Summary Box
        const summaryX = margin + 90;
        const summaryWidth = contentWidth - 90;
        doc.setFillColor(250, 250, 250); // #fafafa
        doc.roundedRect(summaryX, currentY, summaryWidth, 80, 2, 2, 'F');

        doc.setTextColor(161, 161, 170);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('APPRAISAL SUMMARY', summaryX + 10, currentY + 12);

        doc.setTextColor(82, 82, 91); // #52525b
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        const summaryText = 'This document provides a comprehensive visual appraisal generated via advanced computer vision. It includes material classification, stone assessment, and market valuation based on real-time retail data.';
        const splitSummary = doc.splitTextToSize(summaryText, summaryWidth - 20);
        doc.text(splitSummary, summaryX + 10, currentY + 22, { lineHeightFactor: 1.6 });

        // Date area
        doc.setDrawColor(228, 228, 231); // #e4e4e7
        doc.line(summaryX + 10, currentY + 60, summaryX + summaryWidth - 10, currentY + 60);

        doc.setTextColor(161, 161, 170);
        doc.setFontSize(7);
        doc.text('DATE OF ISSUE', summaryX + 10, currentY + 68);
        doc.setTextColor(24, 24, 27);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(date, summaryX + 10, currentY + 75);

        currentY += 95;

        // --- Analysis Content Parsing ---
        const lines = result.split('\n');
        let inTable = false;
        let tableRows: string[][] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (currentY > pageHeight - 30) {
                doc.addPage();
                currentY = 25;
            }

            // Handle Tables
            if (line.startsWith('|')) {
                if (!inTable) {
                    inTable = true;
                    tableRows = [];
                }
                if (!line.match(/^\|?\s*:?-+:?\s*\|/)) {
                    const cells = line.split('|').filter((c: string) => c.trim() !== '').map((c: string) => c.trim());
                    if (cells.length > 0) tableRows.push(cells);
                }
                continue;
            } else if (inTable) {
                inTable = false;
                if (tableRows.length > 0) {
                    const head = [tableRows[0]];
                    const body = tableRows.slice(1);

                    const columnStyles: any = {};
                    if (head[0].some((h: string) => h.toLowerCase().includes('price') || h.toLowerCase().includes('retail'))) {
                        columnStyles[0] = { cellWidth: 25 };
                        columnStyles[1] = { cellWidth: 25 };
                        columnStyles[2] = { cellWidth: 55 };
                    }

                    autoTable(doc, {
                        startY: currentY,
                        head: head,
                        body: body,
                        margin: { left: margin, right: margin },
                        theme: 'striped',
                        headStyles: {
                            fillColor: [17, 24, 39],
                            fontSize: 9,
                            fontStyle: 'bold',
                            cellPadding: 4,
                            halign: 'left'
                        },
                        bodyStyles: {
                            fontSize: 9,
                            textColor: [75, 85, 99],
                            cellPadding: 4,
                            valign: 'middle'
                        },
                        columnStyles: columnStyles,
                        alternateRowStyles: { fillColor: [249, 250, 251] },
                        styles: {
                            overflow: 'linebreak',
                            cellWidth: 'wrap',
                            font: 'helvetica'
                        }
                    });
                    currentY = (doc as any).lastAutoTable.finalY + 12;
                }
            }

            if (line === '') {
                currentY += 5;
                continue;
            }

            // Headers
            if (line.startsWith('# ')) {
                currentY = drawSectionHeader(line.replace('# ', ''), currentY - 5);
            } else if (line.startsWith('## ')) {
                doc.setTextColor(24, 24, 27);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(13);
                doc.text(line.replace('## ', ''), margin, currentY);
                currentY += 8;
            } else if (line.startsWith('### ')) {
                doc.setTextColor(31, 41, 55);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.text(line.replace('### ', ''), margin, currentY);
                currentY += 7;
            }
            // Lists
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                doc.setTextColor(75, 85, 99);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                const text = line.substring(2);
                const splitText = doc.splitTextToSize(`•  ${text}`, contentWidth - 5);
                doc.text(splitText, margin + 2, currentY, { lineHeightFactor: 1.5 });
                currentY += (splitText.length * 6);
            }
            // Regular Paragraphs
            else {
                doc.setTextColor(75, 85, 99);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);

                const wrappedLines = doc.splitTextToSize(line, contentWidth);
                doc.text(wrappedLines, margin, currentY, { lineHeightFactor: 1.5 });
                currentY += (wrappedLines.length * 6);
            }
        }

        // Footer on every page
        const totalPages = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setDrawColor(243, 244, 246);
            doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
            doc.setTextColor(156, 163, 175);
            doc.setFontSize(7);
            doc.text(`© ${new Date().getFullYear()} PS • CONFIDENTIAL REPORT • PAGE ${i} OF ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }

        const pdfOutput = doc.output('arraybuffer');
        return new NextResponse(pdfOutput, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=GemSight-Report-${Date.now()}.pdf`,
            },
        });
    } catch (error) {
        console.error('PDF Export Error:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}

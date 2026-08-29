// components/DynamicInvoicePdf.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metaBlock: {
    lineHeight: 1.4,
  },
  statusBadge: {
    backgroundColor: '#f0ad4e',
    color: 'white',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 10,
  },
  
  // TABLE STYLES
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeaderRow: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontWeight: 'bold',
  },
  
  // Specific Column Widths totaling 100%
  colIdx: { width: '6%', textAlign: 'center' },
  colDesc: { width: '38%', paddingLeft: 5 },
  colQty: { width: '10%', textAlign: 'center' },
  colUnit: { width: '12%', textAlign: 'center' },
  colPrice: { width: '17%', textAlign: 'right', paddingRight: 5 },
  colAmount: { width: '17%', textAlign: 'right', paddingRight: 5 },

  tableCell: {
    fontSize: 9,
  },
  
  // SUMMARY STYLES
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  summaryBlock: {
    width: '40%',
    lineHeight: 1.6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 4,
    marginTop: 4,
    fontWeight: 'bold',
  },
  
  notesSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#888',
  },
});

export interface LineItem {
  product: string;
  quantity: number;
  unit: string;
  price: number;
  vat: number;
}

interface DynamicPdfProps {
  title: string;
  items: LineItem[];
  details: {
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    dueDate: string;
    paymentStatus: string;
    commentaryNotes: string;
    invoice_no: string;
  };
}

export const DynamicInvoicePdf = ({ title, items = [], details }: DynamicPdfProps) => {
  // 1. Calculate totals BEFORE JSX render pass
  let subtotal = 0;
  let totalTax = 0;

  const processedItems = items.map((item, index) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const vatRate = Number(item.vat) || 0;

    let baseAmount = price * qty;
    let vatAmount = 0;

    if (vatRate > 0) {
      vatAmount = (vatRate / 100) * baseAmount;
      baseAmount -= vatAmount; // matching your net logic
    }

    subtotal += baseAmount;
    totalTax += vatAmount;

    return {
      ...item,
      index: index + 1,
      qty,
      price,
      rowAmount: baseAmount,
    };
  });

  const grandTotal = subtotal + totalTax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Customer & Invoice Meta Info */}
        <View style={styles.metaSection}>
          <View style={styles.metaBlock}>
            <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>To:</Text>
            <Text>{details?.customerName}</Text>
            <Text>{details?.customerAddress}</Text>
            <Text>Phone: {details?.customerPhone}</Text>
          </View>

          <View style={styles.metaBlock}>
            <Text>Invoice Number: {details?.invoice_no}</Text>
            <Text>Due Date: {details?.dueDate}</Text>
            <Text>
              Payment Status:{' '}
              <Text style={styles.statusBadge}>{details?.paymentStatus || 'Pending'}</Text>
            </Text>
          </View>
        </View>

        {/* Outer Table Wrap */}
        <View style={styles.table}>
          
          {/* Table Header Row */}
          <View style={[styles.tableRow, styles.tableHeaderRow]} fixed>
            <View style={styles.colIdx}><Text style={styles.tableCell}>#</Text></View>
            <View style={styles.colDesc}><Text style={styles.tableCell}>Description</Text></View>
            <View style={styles.colQty}><Text style={styles.tableCell}>Qty</Text></View>
            <View style={styles.colUnit}><Text style={styles.tableCell}>Unit</Text></View>
            <View style={styles.colPrice}><Text style={styles.tableCell}>Unit Price</Text></View>
            <View style={styles.colAmount}><Text style={styles.tableCell}>Amount</Text></View>
          </View>

          {/* Dynamic Table Body */}
          {processedItems.map((row) => (
            <View key={row.index} style={styles.tableRow} wrap={false}>
              <View style={styles.colIdx}>
                <Text style={styles.tableCell}>{row.index}</Text>
              </View>
              <View style={styles.colDesc}>
                <Text style={styles.tableCell}>{row.product}</Text>
              </View>
              <View style={styles.colQty}>
                <Text style={styles.tableCell}>{row.qty}</Text>
              </View>
              <View style={styles.colUnit}>
                <Text style={styles.tableCell}>{row.unit || '-'}</Text>
              </View>
              <View style={styles.colPrice}>
                <Text style={styles.tableCell}>{row.price.toFixed(2)}</Text>
              </View>
              <View style={styles.colAmount}>
                <Text style={styles.tableCell}>{row.rowAmount.toFixed(2)}</Text>
              </View>
            </View>
          ))}

        </View>

        {/* Summary Totals */}
        <View style={styles.summaryContainer} wrap={false}>
          <View style={styles.summaryBlock}>
            <View style={styles.summaryRow}>
              <Text>Subtotal:</Text>
              <Text>{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Tax:</Text>
              <Text>{totalTax.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryTotalRow}>
              <Text>Total Amount:</Text>
              <Text>{grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {details?.commentaryNotes && (
          <View style={styles.notesSection} wrap={false}>
            <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>Commentary Notes:</Text>
            <Text>{details.commentaryNotes}</Text>
          </View>
        )}

        {/* Dynamic Footer */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};
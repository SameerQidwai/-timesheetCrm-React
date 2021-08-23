import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import '../Styles/pdf.css'
const TimeSheetPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
        <p class="p0 ft0">Sensitive: Personal (after first entry)</p>
        <p class="p1 ft1">Timesheet</p>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
);

const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    }
  });
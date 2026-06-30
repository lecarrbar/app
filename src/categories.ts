import type { Category } from '@/types/question';

export const categories: Category[] = [
  {
    id: 'T1',
    name: 'FCC Rules & Regulations',
    subcategories: [
      { id: 'T1A', name: 'Amateur Radio Service Purpose & Definitions' },
      { id: 'T1B', name: 'Authorized Frequencies & Emissions' },
      { id: 'T1C', name: 'Operator Classes & Station Call Signs' },
      { id: 'T1D', name: 'Authorized & Prohibited Transmissions' },
      { id: 'T1E', name: 'Control Operator Duties' },
      { id: 'T1F', name: 'Station Identification' },
    ],
  },
  {
    id: 'T2',
    name: 'Operating Procedures',
    subcategories: [
      { id: 'T2A', name: 'Station Operation' },
      { id: 'T2B', name: 'VHF/UHF Operating Practices' },
      { id: 'T2C', name: 'Public Service & Emergency Communications' },
    ],
  },
  {
    id: 'T3',
    name: 'Radio Wave Characteristics',
    subcategories: [
      { id: 'T3A', name: 'Radio Wave Properties' },
      { id: 'T3B', name: 'Frequency & Wavelength' },
      { id: 'T3C', name: 'Propagation Modes' },
    ],
  },
  {
    id: 'T4',
    name: 'Amateur Radio Practices',
    subcategories: [
      { id: 'T4A', name: 'Station Setup & Operation' },
      { id: 'T4B', name: 'Operating Controls & Settings' },
    ],
  },
  {
    id: 'T5',
    name: 'Electrical Principles',
    subcategories: [
      { id: 'T5A', name: 'Electrical Units' },
      { id: 'T5B', name: 'Math for Electronics' },
      { id: 'T5C', name: 'Electronic Principles' },
      { id: 'T5D', name: 'Ohm\'s Law' },
    ],
  },
  {
    id: 'T6',
    name: 'Electrical Components',
    subcategories: [
      { id: 'T6A', name: 'Resistors, Capacitors & Inductors' },
      { id: 'T6B', name: 'Semiconductors' },
      { id: 'T6C', name: 'Circuit Diagrams' },
      { id: 'T6D', name: 'Component Functions' },
    ],
  },
  {
    id: 'T7',
    name: 'Station Equipment',
    subcategories: [
      { id: 'T7A', name: 'Transmitters & Receivers' },
      { id: 'T7B', name: 'Common Transmitter & Receiver Problems' },
      { id: 'T7C', name: 'Antenna & Feed Line Measurements' },
      { id: 'T7D', name: 'Power Supplies' },
    ],
  },
  {
    id: 'T8',
    name: 'Modulation & Modes',
    subcategories: [
      { id: 'T8A', name: 'FM Phone' },
      { id: 'T8B', name: 'SSB & AM Phone' },
      { id: 'T8C', name: 'Digital Modes' },
      { id: 'T8D', name: 'Satellite Operation' },
    ],
  },
  {
    id: 'T9',
    name: 'Antennas & Feed Lines',
    subcategories: [
      { id: 'T9A', name: 'Antenna Types' },
      { id: 'T9B', name: 'Feed Lines & Connectors' },
    ],
  },
  {
    id: 'T0',
    name: 'Electrical & RF Safety',
    subcategories: [
      { id: 'T0A', name: 'AC Power Circuits' },
      { id: 'T0B', name: 'Antenna & Tower Safety' },
      { id: 'T0C', name: 'RF Exposure Safety' },
    ],
  },
];

export const categoryColors: Record<string, string> = {
  T1: '#3b82f6',
  T2: '#10b981',
  T3: '#f59e0b',
  T4: '#8b5cf6',
  T5: '#ef4444',
  T6: '#06b6d4',
  T7: '#ec4899',
  T8: '#84cc16',
  T9: '#f97316',
  T0: '#6366f1',
};

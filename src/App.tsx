/**
 * VisiNinja - Android XLSX Cleaner & Stephanie Evergreen Effective Data Visualization App
 * Created by Alakh
 * Integrated with Gemini, Claude, Perplexity, Copilot, and ChatGPT AI Consensus
 */

import React, { useState, useMemo } from 'react';
import { CleanedDataset } from './types/data';
import { SAMPLE_DATASETS } from './data/sampleDatasets';
import { cleanDataset, DEFAULT_CLEANING_OPTIONS } from './utils/dataCleaner';
import { recommendChartsForDataset } from './utils/chartChooser';
import { AndroidShell } from './components/AndroidShell';
import { FeedDataScreen } from './components/screens/FeedDataScreen';
import { CleanAuditScreen } from './components/screens/CleanAuditScreen';
import { ChartChooserScreen } from './components/screens/ChartChooserScreen';
import { VisualizationsScreen } from './components/screens/VisualizationsScreen';
import { AIDecisionCouncilScreen } from './components/screens/AIDecisionCouncilScreen';
import { AndroidInstallScreen } from './components/screens/AndroidInstallScreen';
import { AboutBrandScreen } from './components/screens/AboutBrandScreen';

export default function App() {
  // Initialize with initial dataset from Stephanie Evergreen's book
  const initialSample = SAMPLE_DATASETS[0];
  const initialDataset = useMemo(() => {
    return cleanDataset(
      initialSample.rawRows,
      `${initialSample.name}.xlsx`,
      'SampleData',
      DEFAULT_CLEANING_OPTIONS,
      ['SampleData']
    );
  }, []);

  const [currentDataset, setCurrentDataset] = useState<CleanedDataset>(initialDataset);
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [activeChartId, setActiveChartId] = useState<string>('slopegraph');

  // When a new dataset is loaded
  const handleDatasetLoaded = (newDataset: CleanedDataset) => {
    setCurrentDataset(newDataset);
    const rec = recommendChartsForDataset(newDataset);
    setActiveChartId(rec.primaryRecommendation.id);
    setActiveTab('clean');
  };

  // When user selects a chart in the Chart Chooser
  const handleSelectChart = (chartId: string) => {
    setActiveChartId(chartId);
    setActiveTab('viz');
  };

  // When user applies recommendation from the 5-Model AI Council
  const handleApplyConsensus = (chartId: string) => {
    setActiveChartId(chartId);
    setActiveTab('viz');
  };

  return (
    <AndroidShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      datasetName={currentDataset?.fileName}
    >
      {activeTab === 'feed' && (
        <FeedDataScreen
          currentDataset={currentDataset}
          onDatasetLoaded={handleDatasetLoaded}
          onNavigateToTab={setActiveTab}
        />
      )}

      {activeTab === 'clean' && (
        <CleanAuditScreen
          dataset={currentDataset}
          onUpdateDataset={setCurrentDataset}
          onNavigateToVisualizations={() => setActiveTab('viz')}
        />
      )}

      {activeTab === 'council' && (
        <AIDecisionCouncilScreen
          dataset={currentDataset}
          onApplyConsensus={handleApplyConsensus}
        />
      )}

      {activeTab === 'chooser' && (
        <ChartChooserScreen
          dataset={currentDataset}
          onSelectChart={handleSelectChart}
        />
      )}

      {activeTab === 'viz' && (
        <VisualizationsScreen
          dataset={currentDataset}
          activeChartId={activeChartId}
          onSelectChart={setActiveChartId}
        />
      )}

      {activeTab === 'apk' && (
        <AndroidInstallScreen />
      )}

      {activeTab === 'about' && (
        <AboutBrandScreen />
      )}
    </AndroidShell>
  );
}

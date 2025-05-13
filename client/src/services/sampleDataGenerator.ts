import * as tf from '@tensorflow/tfjs';

/**
 * Service for generating sample datasets to test the mental health AI dashboard
 * This allows users to test the functionality without real patient data
 */

/**
 * Generate sample EEG data in CSV format
 * @param duration Duration in seconds
 * @param channels Number of EEG channels
 * @param condition The mental health condition to simulate (affects patterns)
 */
export function generateEEGSample(
  duration: number = 60,
  channels: number = 8,
  condition: 'anxiety' | 'depression' | 'normal' = 'anxiety'
): string {
  // Sampling rate (samples per second)
  const samplingRate = 250;
  const totalSamples = duration * samplingRate;
  
  // Channel names for EEG data
  const channelNames = ['Fp1', 'Fp2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2'].slice(0, channels);
  
  // Base frequencies for different brain wave patterns
  const frequencyRanges = {
    delta: { min: 0.5, max: 4 },   // Sleep, deep relaxation
    theta: { min: 4, max: 8 },     // Drowsiness, meditation
    alpha: { min: 8, max: 13 },    // Relaxed but alert
    beta: { min: 13, max: 30 },    // Active thinking, focus
    gamma: { min: 30, max: 100 }   // Cognitive processing, anxiety
  };
  
  // Adjust amplitudes based on condition
  const amplitudes = {
    normal: { delta: 30, theta: 25, alpha: 40, beta: 20, gamma: 10 },
    anxiety: { delta: 15, theta: 20, alpha: 15, beta: 40, gamma: 45 },
    depression: { delta: 45, theta: 40, alpha: 20, beta: 15, gamma: 5 }
  };
  
  // Noise level based on condition
  const noiseLevels = {
    normal: 0.1,
    anxiety: 0.2,
    depression: 0.15
  };
  
  const selectedAmplitudes = amplitudes[condition];
  const noiseLevel = noiseLevels[condition];
  
  // Generate timestamps
  const timestamps = Array.from({ length: totalSamples }, (_, i) => i / samplingRate);
  
  // Generate data for each channel
  const channelData: number[][] = [];
  
  for (let c = 0; c < channels; c++) {
    const channelValues: number[] = [];
    
    // Add slight variation to each channel
    const channelVariation = Math.random() * 0.2 + 0.9;
    
    for (let i = 0; i < totalSamples; i++) {
      const time = i / samplingRate;
      
      // Generate base signal as sum of different frequency components
      let value = 0;
      
      // Delta waves
      value += selectedAmplitudes.delta * channelVariation * 
        Math.sin(2 * Math.PI * (Math.random() * (frequencyRanges.delta.max - frequencyRanges.delta.min) + frequencyRanges.delta.min) * time);
      
      // Theta waves
      value += selectedAmplitudes.theta * channelVariation * 
        Math.sin(2 * Math.PI * (Math.random() * (frequencyRanges.theta.max - frequencyRanges.theta.min) + frequencyRanges.theta.min) * time);
      
      // Alpha waves
      value += selectedAmplitudes.alpha * channelVariation * 
        Math.sin(2 * Math.PI * (Math.random() * (frequencyRanges.alpha.max - frequencyRanges.alpha.min) + frequencyRanges.alpha.min) * time);
      
      // Beta waves
      value += selectedAmplitudes.beta * channelVariation * 
        Math.sin(2 * Math.PI * (Math.random() * (frequencyRanges.beta.max - frequencyRanges.beta.min) + frequencyRanges.beta.min) * time);
      
      // Gamma waves
      value += selectedAmplitudes.gamma * channelVariation * 
        Math.sin(2 * Math.PI * (Math.random() * (frequencyRanges.gamma.max - frequencyRanges.gamma.min) + frequencyRanges.gamma.min) * time);
      
      // Add random noise
      value += (Math.random() * 2 - 1) * noiseLevel * 100;
      
      channelValues.push(value);
    }
    
    channelData.push(channelValues);
  }
  
  // Construct CSV content
  let csvContent = 'timestamp,' + channelNames.join(',') + '\n';
  
  for (let i = 0; i < totalSamples; i++) {
    const row = [timestamps[i]];
    for (let c = 0; c < channels; c++) {
      row.push(channelData[c][i]);
    }
    csvContent += row.join(',') + '\n';
  }
  
  return csvContent;
}

/**
 * Generate sample mood survey data in CSV format
 * @param entries Number of daily entries
 * @param condition The mental health condition to simulate
 */
export function generateMoodSurveySample(
  entries: number = 30,
  condition: 'anxiety' | 'depression' | 'normal' = 'anxiety'
): string {
  // Define baseline values for different conditions
  const baselines = {
    normal: { mood: 7, anxiety: 3, energy: 6, sleep: 7, socialInteraction: 6 },
    anxiety: { mood: 5, anxiety: 8, energy: 4, sleep: 4, socialInteraction: 3 },
    depression: { mood: 3, anxiety: 5, energy: 2, sleep: 6, socialInteraction: 2 }
  };
  
  const baseline = baselines[condition];
  
  // Generate timestamps (one per day, going back from today)
  const now = new Date();
  const timestamps = Array.from({ length: entries }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (entries - i - 1));
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });
  
  // Headers for the CSV file
  const headers = ['date', 'mood', 'anxiety', 'energy', 'sleep_hours', 'social_interaction', 'notes'];
  
  // Generate survey entries
  const rows: string[][] = [];
  
  for (let i = 0; i < entries; i++) {
    const variation = Math.sin(i * 0.4) * 1.5; // Create a sinusoidal pattern for natural variation
    
    // Create some randomness but stay around the baseline
    const mood = Math.max(1, Math.min(10, Math.round(baseline.mood + variation + (Math.random() * 2 - 1))));
    const anxiety = Math.max(1, Math.min(10, Math.round(baseline.anxiety + variation + (Math.random() * 2 - 1))));
    const energy = Math.max(1, Math.min(10, Math.round(baseline.energy + variation + (Math.random() * 2 - 1))));
    const sleep = Math.max(2, Math.min(12, baseline.sleep + variation / 2 + (Math.random() * 2 - 1)));
    const socialInteraction = Math.max(1, Math.min(10, Math.round(baseline.socialInteraction + variation + (Math.random() * 2 - 1))));
    
    // Generate notes based on the condition
    let notes = '';
    if (condition === 'anxiety') {
      const anxietyNotes = [
        'Feeling on edge all day',
        'Worried about work presentation',
        'Racing thoughts before bed',
        'Felt panicky at the store',
        'Constant worry about health',
        'Hard to concentrate due to worries',
        'Stomach in knots all day'
      ];
      notes = anxiety > 6 ? anxietyNotes[Math.floor(Math.random() * anxietyNotes.length)] : '';
    } else if (condition === 'depression') {
      const depressionNotes = [
        'No motivation to get out of bed',
        'Everything feels pointless',
        'Canceled plans with friends',
        'Couldn\'t enjoy favorite activities',
        'Feel empty inside',
        'Crying for no reason',
        'Just want to sleep all day'
      ];
      notes = mood < 4 ? depressionNotes[Math.floor(Math.random() * depressionNotes.length)] : '';
    }
    
    rows.push([
      timestamps[i],
      mood.toString(),
      anxiety.toString(),
      energy.toString(),
      sleep.toFixed(1),
      socialInteraction.toString(),
      notes
    ]);
  }
  
  // Construct CSV content
  let csvContent = headers.join(',') + '\n';
  rows.forEach(row => {
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
}

/**
 * Generate sample journal entries as text
 * @param entries Number of journal entries
 * @param condition The mental health condition to simulate
 */
export function generateJournalSample(
  entries: number = 7,
  condition: 'anxiety' | 'depression' | 'normal' = 'anxiety'
): string {
  // Define sample journal entries for different conditions
  const journalTemplates = {
    anxiety: [
      "Today I felt really anxious about my upcoming presentation. My heart was racing and I couldn't focus on anything else. I kept imagining all the ways I could mess up and embarrass myself in front of everyone. I tried some deep breathing exercises, but they only helped a little bit.",
      
      "I had a panic attack at the grocery store today. It came out of nowhere - suddenly I felt like I couldn't breathe and needed to get out immediately. I left my cart in the middle of the aisle and just went to my car. I sat there for 30 minutes trying to calm down before I could drive home.",
      
      "The constant worry is exhausting. I keep checking my phone to see if my boss responded to my email. I'm convinced I made a mistake on that report and I'll get fired. I know it's probably not rational but I can't stop the thoughts from spinning out of control.",
      
      "Had trouble sleeping again last night. My mind just wouldn't shut off - kept thinking about all my deadlines and responsibilities. I tossed and turned until 3 AM. Now I'm worried that being tired will make me perform poorly at work, which is making me even more anxious.",
      
      "Social situations are getting harder. I was invited to a party this weekend but the thought of making small talk with strangers makes my chest tight. I'll probably make up an excuse not to go, even though I know isolating myself only makes things worse in the long run."
    ],
    
    depression: [
      "I couldn't get out of bed today. There just didn't seem to be any point. I called in sick to work again, which is making me worry about losing my job, but I just couldn't face anyone. Everything feels gray and pointless.",
      
      "I used to enjoy painting, but I haven't touched my art supplies in weeks. I look at my easel and feel nothing. All my hobbies seem meaningless now. I'm just going through the motions of living without feeling anything real.",
      
      "Had dinner with my family, but I felt disconnected from everyone. They were all laughing and talking, and I was just sitting there, feeling like I was watching everything from behind glass. I don't know how to explain to them that I'm not really 'here' anymore.",
      
      "I keep sleeping for 12+ hours but still feel exhausted. The dreams are vivid and disturbing, and waking up is the worst part of the day. The weight on my chest feels physical sometimes, like I'm being crushed from the inside.",
      
      "Can't remember the last time I felt genuine happiness. I smile and nod when appropriate in conversations, but it's all an act. I feel like I'm disappearing a little more each day, and the scariest part is that I'm not sure if I care anymore."
    ],
    
    normal: [
      "Had a productive day at work today. Crossed off most items on my to-do list and got some positive feedback on my project. Feeling satisfied with what I accomplished. Looking forward to relaxing this evening and maybe watching that new show everyone's talking about.",
      
      "Went for a hike with friends this morning. The weather was perfect and the views from the top were amazing. We had lunch at the summit and talked about planning a camping trip next month. Came home tired but in a good way.",
      
      "Had some minor stress about a deadline today, but I managed to prioritize my tasks and get everything done on time. Celebrated by treating myself to ice cream on the way home. Sometimes the small rewards make all the difference in staying motivated.",
      
      "Tried that new recipe for dinner tonight and it turned out great! The family loved it. Had a good conversation with the kids about their school projects. These ordinary moments of connection are really what makes life meaningful.",
      
      "Feeling grateful today. Nothing particularly special happened, but I took a moment to appreciate the good things in my life - my health, my relationships, having a safe place to live. It's easy to overlook these basics, but they're the foundation of everything else."
    ]
  };
  
  // Mix templates with some randomized content
  const templates = journalTemplates[condition];
  let journalContent = '';
  
  const now = new Date();
  
  for (let i = 0; i < entries; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() - (entries - i - 1));
    const dateString = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    // Select a template or generate a mixed entry
    let entry = '';
    if (Math.random() > 0.7) {
      // Use a pure template
      entry = templates[Math.floor(Math.random() * templates.length)];
    } else {
      // Create a mixed entry
      const sentences = [];
      // Get sentences from random templates
      for (let j = 0; j < 4; j++) {
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        const templateSentences = randomTemplate.split('. ');
        sentences.push(templateSentences[Math.floor(Math.random() * templateSentences.length)]);
      }
      entry = sentences.join('. ') + '.';
    }
    
    journalContent += `## ${dateString}\n\n${entry}\n\n`;
  }
  
  return journalContent;
}

/**
 * Generate a complete MODMA dataset
 * (Multimodal Open Dataset for Mental health Analysis)
 */
export function generateMODMADataset(
  condition: 'anxiety' | 'depression' | 'normal' = 'anxiety'
): any {
  // Create metadata
  const metadata = {
    format_version: "1.0.0",
    creation_date: new Date().toISOString(),
    condition_simulated: condition,
    data_quality: {
      completeness: 0.98,
      consistency: 0.95
    },
    description: `Simulated MODMA dataset for ${condition} condition testing purposes.`
  };
  
  // Generate EEG data
  const eegData = [];
  const eegRawData = generateEEGSample(30, 8, condition);
  const eegLines = eegRawData.split('\n');
  const eegHeaders = eegLines[0].split(',');
  
  for (let i = 1; i < eegLines.length; i++) {
    if (!eegLines[i].trim()) continue;
    
    const values = eegLines[i].split(',');
    const dataPoint: any = { timestamp: parseFloat(values[0]) };
    
    for (let j = 1; j < eegHeaders.length; j++) {
      dataPoint[eegHeaders[j]] = parseFloat(values[j]);
    }
    
    eegData.push(dataPoint);
  }
  
  // Generate audio features (simulated MFCC coefficients)
  const audioData = [];
  const frames = 100;
  const mfccCoefficients = 13;
  
  for (let i = 0; i < frames; i++) {
    const frame: any = {
      frame_id: i,
      timestamp: i * 0.1, // Assuming 100ms frames
      mfcc: Array.from({ length: mfccCoefficients }, () => Math.random() * 2 - 1),
      energy: Math.random() * 0.5 + 0.5
    };
    
    // Add specific patterns based on condition
    if (condition === 'anxiety') {
      // Higher energy, more variation in higher coefficients
      frame.energy += 0.2;
      frame.mfcc = frame.mfcc.map((val: number, idx: number) => 
        idx > 6 ? val * 1.5 : val
      );
    } else if (condition === 'depression') {
      // Lower energy, less variation
      frame.energy -= 0.3;
      frame.mfcc = frame.mfcc.map((val: number) => val * 0.7);
    }
    
    audioData.push(frame);
  }
  
  // Generate text data (journal entries)
  const textData = {
    journal_entries: generateJournalSample(5, condition),
    mood_survey: generateMoodSurveySample(14, condition)
  };
  
  // Combine into MODMA dataset
  return {
    metadata,
    eeg_data: eegData,
    audio_data: audioData,
    text_data: textData
  };
}

/**
 * Download sample datasets as files
 */
export function downloadSampleDatasets(): void {
  // Generate and download EEG sample
  const eegSample = generateEEGSample(60, 8, 'anxiety');
  downloadFile(eegSample, 'anxiety_eeg_sample.csv', 'text/csv');
  
  // Generate and download mood survey
  const moodSample = generateMoodSurveySample(30, 'anxiety');
  downloadFile(moodSample, 'anxiety_mood_survey.csv', 'text/csv');
  
  // Generate and download journal entries
  const journalSample = generateJournalSample(7, 'anxiety');
  downloadFile(journalSample, 'anxiety_journal.txt', 'text/plain');
  
  // Generate and download complete MODMA dataset
  const modmaSample = generateMODMADataset('anxiety');
  downloadFile(JSON.stringify(modmaSample, null, 2), 'anxiety_modma_dataset.json', 'application/json');
}

/**
 * Helper function to download data as a file
 */
function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
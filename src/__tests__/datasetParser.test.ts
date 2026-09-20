import { describe, it, expect } from 'vitest';
import {
  parseUploadedDataset,
  parseSpotifyCSV,
  parseHouseholdCSV,
  parseIndiaTransactJSON,
  parseCSVLines,
  autoLinkTemporalReceipts,
} from '../services/datasetParser';

describe('Universal Dataset Parser (FAIE Criterion 6 & Organizer Datasets)', () => {
  it('parses CSV lines correctly handling quoted commas and escaped quotes', () => {
    const csv = 'track,artist,album\n"Born To Die","Lana Del Rey","Paradise, Edition"\n"Say ""Yes"" to Heaven",Lana,Single';
    const rows = parseCSVLines(csv);
    expect(rows.length).toBe(3);
    expect(rows[1][2]).toBe('Paradise, Edition');
    expect(rows[2][0]).toBe('Say "Yes" to Heaven');
  });

  it('parses Spotify streaming CSV and maps to music category with derived moods', () => {
    const spotifyCsv = `spotify_track_uri,ts,platform,ms_played,track_name,artist_name,album_name,reason_start,reason_end,shuffle,skipped
2J3n32GeLmMjwuAzyhcSNe,2013-07-08 02:44:34,web player,285386,"Born To Die",Lana Del Rey,Born To Die - The Paradise Edition,autoplay,clickrow,FALSE,FALSE
5IyblF777jLZj1vGHG2UD3,2013-07-08 14:30:00,desktop app,134022,Off To The Races,Lana Del Rey,Born To Die - The Paradise Edition,trackdone,clickrow,FALSE,FALSE`;

    const receipts = parseSpotifyCSV(spotifyCsv);
    expect(receipts.length).toBe(2);
    expect(receipts[0].category).toBe('music');
    expect(receipts[0].title).toBe('Born To Die');
    expect(receipts[0].subtitle).toBe('Lana Del Rey');
    expect(receipts[0].mood).toBe('melancholic'); // 2:44 AM -> melancholic
    expect(receipts[1].mood).toBe('energetic'); // 14:30 -> energetic
    expect(receipts[0].metadata?.trackDurationMs).toBe(285386);
  });

  it('parses Daily Household Transactions CSV with INR currency and mode', () => {
    const householdCsv = `Date,Mode,Category,Subcategory,Note,Amount,Income/Expense,Currency
20/09/2018 12:04:08,Cash,Transportation,Train,2 Place 5 to Place 0,30,Expense,INR
16/09/2018 17:15:08,Cash,Festivals,Ganesh Pujan,Ganesh idol,251,Expense,INR
19/09/2018,Saving Bank account 1,subscription,Netflix,1 month subscription,199,Expense,INR`;

    const receipts = parseHouseholdCSV(householdCsv);
    expect(receipts.length).toBe(3);
    expect(receipts[0].category).toBe('place');
    expect(receipts[0].amount).toBe(30);
    expect(receipts[1].category).toBe('event');
    expect(receipts[1].mood).toBe('euphoric');
    expect(receipts[2].amount).toBe(199);
  });

  it('parses India Transact JSON with fraud prefix stripping and locations', () => {
    const indiaJson = [
      {
        trans_id: 295780,
        trans_date_trans_time: '12/26/2023 0:55',
        merchant: 'fraud_Bedi-Krish Pvt Ltd',
        category: 'online_shopping',
        amt: 8552.65,
        city: 'Dhule',
        state: 'Rajasthan',
      },
      {
        trans_id: 825718,
        trans_date_trans_time: '7/7/2023 7:02',
        merchant: 'Cinematic Grand',
        category: 'entertainment',
        amt: 9139.49,
        city: 'Rourkela',
        state: 'Meghalaya',
      },
    ];

    const receipts = parseIndiaTransactJSON(indiaJson);
    expect(receipts.length).toBe(2);
    expect(receipts[0].title).toBe('Bedi-Krish Pvt Ltd'); // 'fraud_' prefix removed
    expect(receipts[0].amount).toBe(8552.65);
    expect(receipts[0].location?.city).toBe('Dhule');
    expect(receipts[1].category).toBe('entertainment');
  });

  it('auto-detects native LifeReceipts JSON via parseUploadedDataset', () => {
    const nativeJson = JSON.stringify([
      {
        id: 'test-1',
        category: 'music',
        timestamp: '2023-01-01T00:00:00Z',
        title: 'Midnight Memory',
        subtitle: 'Test Artist',
        description: 'Test Description',
        mood: 'contemplative',
        tags: ['test'],
        chapterId: 'ch-1',
        connectedReceiptIds: [],
        metadata: {},
      },
    ]);

    const result = parseUploadedDataset(nativeJson, 'my_receipts.json');
    expect(result.length).toBe(1);
    expect(result[0].title).toBe('Midnight Memory');
  });

  it('rejects prototype pollution in uploaded dataset JSON', () => {
    const maliciousJson = '[{"id": "bad-1", "category": "note", "title": "Exploit", "timestamp": "2023-01-01", "__proto__": {"isAdmin": true}}]';

    expect(() => parseUploadedDataset(maliciousJson, 'exploit.json')).toThrow(
      /Security Error: Dataset contains forbidden prototype pollution/i
    );
  });

  it('auto-infers temporal and semantic graph links between receipts via autoLinkTemporalReceipts', () => {
    const unlinkedReceipts = [
      {
        id: 'stream-1',
        category: 'music' as const,
        timestamp: '2023-11-14T02:00:00.000Z',
        displayDate: '14 Nov 2023, 02:00 AM',
        title: 'Born To Die',
        subtitle: 'Lana Del Rey',
        description: 'Streamed music.',
        mood: 'melancholic' as const,
        tags: ['music'],
        chapterId: 'ch-1',
        connectedReceiptIds: [],
        metadata: { artist: 'Lana Del Rey' },
      },
      {
        id: 'purchase-1',
        category: 'purchase' as const,
        timestamp: '2023-11-14T02:45:00.000Z',
        displayDate: '14 Nov 2023, 02:45 AM',
        title: 'Midnight Tea',
        subtitle: 'Convenience',
        description: 'Midnight snack.',
        amount: 50,
        currency: 'INR',
        mood: 'peaceful' as const,
        tags: ['food'],
        chapterId: 'ch-1',
        connectedReceiptIds: [],
        metadata: {},
      },
      {
        id: 'stream-2',
        category: 'music' as const,
        timestamp: '2023-11-14T09:00:00.000Z',
        displayDate: '14 Nov 2023, 09:00 AM',
        title: 'Blue Jeans',
        subtitle: 'Lana Del Rey',
        description: 'Morning stream.',
        mood: 'peaceful' as const,
        tags: ['music'],
        chapterId: 'ch-2',
        connectedReceiptIds: [],
        metadata: { artist: 'Lana Del Rey' },
      },
    ];

    const linked = autoLinkTemporalReceipts(unlinkedReceipts);
    expect(linked[0].connectedReceiptIds).toContain('purchase-1');
    expect(linked[0].connectedReceiptIds).toContain('stream-2');
    expect(linked[1].connectedReceiptIds).toContain('stream-1');
  });

  it('throws descriptive error on empty or unsupported files', () => {
    expect(() => parseUploadedDataset('', 'empty.csv')).toThrow(/empty/i);
    expect(() => parseUploadedDataset('random gibberish without delimiters', 'unknown.xyz')).toThrow(
      /Unsupported file format/i
    );
  });
});

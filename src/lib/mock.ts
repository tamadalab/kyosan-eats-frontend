type Cafeteria = {
  id: number;
  name: string;
  location: string;
  time: string; // 表示用の時間帯（例: "11:00 - 14:00"）
};

// 簡易モック: 日付文字列 (YYYY-MM-DD) に応じて学食データを返す
export function getCafeteriasByDate(date: string): Cafeteria[] {
  // サンプルデータマップ
  const map: Record<string, Cafeteria[]> = {
    // 例: 固定の日付データ
    "2025-11-10": [
      { id: 1, name: "中央食堂", location: "本館1F", time: "11:00 - 14:00" },
      { id: 2, name: "北食堂", location: "北キャンパス2F", time: "10:30 - 13:30" },
    ],
    "2025-11-11": [
      { id: 3, name: "南食堂", location: "南棟B1", time: "11:30 - 15:00" },
    ],
  };

  if (map[date]) return map[date];

  // デフォルトフォールバック: 日の下二桁の偶奇で簡易データを返す
  const day = Number(date.slice(-2));
  if (!isNaN(day) && day % 2 === 0) {
    return [
      { id: 10, name: "フジカツ", location: "並楽館1F", time: "9:00 - 15:00" },
      { id: 11, name: "リブレ", location: "並楽館3F", time: "9:00 - 15:00" },
    ];
  }

  return [];
}


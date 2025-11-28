import { supabase } from "./supabaseClient";

export type StoreHourRow = {
  shop_id: number;
  date: string; // YYYY-MM-DD
  start_time: string;
  end_time: string;
  memo: string | null;
};

export type ShopRow = {
  shop_id: number;
  store_name: string;
  location_name: string;
};

export type MergedStoreInfo = {
  shop_id: number;
  store_name: string;
  location_name: string;
  date: string;
  start_time: string;
  end_time: string;
  memo: string | null;
};

// 指定日付の営業時間情報を取得し、shop_name テーブルと結合した形に整形
export async function fetchStoreHoursByDate(date: string): Promise<{ data: MergedStoreInfo[]; error?: string }> {
  // store_hours を取得
  const { data: hours, error: hoursErr } = await supabase
    .from("store_hours")
    .select("shop_id, date, start_time, end_time, memo")
    .eq("date::date", date) as unknown as { data: StoreHourRow[]; error: any };


  console.log("fetch date:", date);
  console.log("raw hours data:", hours);


  if (hoursErr) {
    return { data: [], error: hoursErr.message };
  }
  if (!hours || hours.length === 0) {
    return { data: [] };
  }

  const shopIds = Array.from(new Set(hours.map((h: StoreHourRow) => h.shop_id)));
  const { data: shops, error: shopsErr } = await supabase
    .from("shop_name")
    .select("shop_id, store_name, location_name")
    .in("shop_id", shopIds) as unknown as { data: ShopRow[]; error: any };

  if (shopsErr) {
    return { data: [], error: shopsErr.message };
  }

  const shopMap = new Map<number, ShopRow>();
  (shops || []).forEach((s: ShopRow) => shopMap.set(s.shop_id, s));

  const merged: MergedStoreInfo[] = hours.map((h: StoreHourRow) => {
    const shop = shopMap.get(h.shop_id);
    return {
      shop_id: h.shop_id,
      store_name: shop?.store_name || "不明",
      location_name: shop?.location_name || "不明",
      date: h.date,
      start_time: h.start_time,
      end_time: h.end_time,
      memo: h.memo ?? null,
    };
  });

  return { data: merged };
}

import { time } from '@/utils/format';
import React, { useState, useEffect, useRef } from 'react';

function QuizCountdown({
  durationInSeconds,
  onTimeUp,
  saveKey = null,
  autoSaveIntervalInSeconds = 30,
  className = null,
}) {

  // State untuk melacak detik tersisa
  const [remainingSeconds, setRemainingSeconds] = useState(durationInSeconds);

  // State untuk melacak kapan terakhir kali kita menyimpan
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());

  // Gunakan Ref untuk menyimpan callback 'onTimeUp'
  // Ini mencegah 'useEffect' di-trigger ulang jika fungsi 'onTimeUp' berubah
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // EFEK 1: Memuat/Reset timer saat komponen mount atau quiz berubah
  useEffect(() => {
    // Coba ambil waktu yang tersimpan dari localStorage
    if (saveKey) {
      const savedTime = localStorage.getItem(saveKey);

      let initialTime;
      if (savedTime !== null) {
        initialTime = parseInt(savedTime, 10);
      } else {
        initialTime = durationInSeconds; // Gunakan durasi penuh jika tidak ada
      }

      setRemainingSeconds(initialTime); // Atur state timer
      setLastSaveTime(Date.now());    // Reset pelacak auto-save
    }

  }, [durationInSeconds, saveKey]); // Jalankan ulang jika quiz ID (saveKey) berubah


  // EFEK 2: Timer utama (tick) dan logika auto-save
  useEffect(() => {
    // 1. Logika Waktu Habis    
    if (remainingSeconds <= 0) {
      if (parseInt(remainingSeconds) === 0) { // Pastikan hanya berjalan sekali
        console.log(`Timer ${saveKey} habis.`);
        if (onTimeUpRef.current) {
          onTimeUpRef.current(); // Panggil callback
        }
        localStorage.removeItem(saveKey); // Hapus data dari storage
      }
      return; // Hentikan timer
    }

    // 2. Logika Hitung Mundur (Tick)
    // Menggunakan setTimeout rekursif lebih stabil daripada setInterval
    const timerId = setTimeout(() => {
      setRemainingSeconds(remainingSeconds - 1);
    }, 1000);

    if (saveKey) {      
      // 3. Logika Auto-Save
      const now = Date.now();
      const timeSinceLastSave = (now - lastSaveTime) / 1000; // dalam detik
  
      if (timeSinceLastSave > autoSaveIntervalInSeconds) {
        // Waktunya menyimpan!
        localStorage.setItem(saveKey, remainingSeconds.toString());
        setLastSaveTime(now); // Perbarui waktu simpan terakhir
      }
    }

    // 4. Cleanup
    // Hapus timeout jika komponen di-unmount atau efek ini berjalan lagi
    return () => clearTimeout(timerId);

  }, [remainingSeconds, saveKey, autoSaveIntervalInSeconds, lastSaveTime]);

  // Render Tampilan
  return (
    <div className={className ?? "text-lg font-bold text-primary"}>
      <p className="font-mono">{time(remainingSeconds)}</p>
    </div>
  );
}

export default QuizCountdown;

function calculate() {
  const inr = parseFloat(document.getElementById("inr").value);
  const bleeding = document.getElementById("bleeding").value;
  const weeklyDose = parseFloat(document.getElementById("weeklyDose").value);
  const result = document.getElementById("result");
  result.innerHTML = "";

  if (isNaN(inr) || isNaN(weeklyDose)) {
    result.innerHTML = "กรุณากรอกข้อมูลให้ครบถ้วน";
    return;
  }

  let recommendation = "";
  let adjustedDose = weeklyDose;

  if (bleeding === "yes") {
    recommendation = "ให้ Vitamin K₁ 10 mg IV + FFP และ repeat ทุก 12 ชม. ถ้าจำเป็น";
    result.innerHTML = recommendation;
    return;
  } else if (inr < 1.5) {
    adjustedDose *= 1.15;
    recommendation = "เพิ่มขนาดยา 10–20%";
  } else if (inr < 2.0) {
    adjustedDose *= 1.075;
    recommendation = "เพิ่มขนาดยา 5–10%";
  } else if (inr <= 3.0) {
    recommendation = "ให้ขนาดยาเท่าเดิม";
  } else if (inr <= 3.9) {
    adjustedDose *= 0.925;
    recommendation = "ลดขนาดยา 5–10%";
  } else if (inr <= 4.9) {
    adjustedDose *= 0.9;
    recommendation = "หยุดยา 1 วัน แล้วลดขนาดยา 10%";
  } else if (inr <= 8.9) {
    recommendation = "หยุดยา 1–2 วัน และให้ Vitamin K₁ 1 mg oral";
    result.innerHTML = recommendation;
    return;
  } else {
    recommendation = "ให้ Vitamin K₁ 5–10 mg oral";
    result.innerHTML = recommendation;
    return;
  }

  const daily = distributeDose(adjustedDose);
  let html = `<p><strong>คำแนะนำ:</strong> ${recommendation}</p>`;
  html += `<p><strong>ขนาดยาใหม่:</strong> ${adjustedDose.toFixed(2)} mg/สัปดาห์</p><div style="font-size:20px;">`;
  const days = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
  let total3 = 0, total5 = 0;

  for (let i = 0; i < 7; i++) {
    html += `<div style="display:inline-block;text-align:center;width:40px;">${days[i]}<br/>`;
    daily[i].forEach(t => {
      if (t === 3) {
        html += `<div class="circle c3"></div>`;
        total3++;
      } else if (t === 5) {
        html += `<div class="circle c5"></div>`;
        total5++;
      } else if (t === 1.5) {
        html += `<div class="circle half"></div>`;
        total3 += 0.5;
      } else if (t === 2.5) {
        html += `<div class="circle" style="background:linear-gradient(to right, deeppink 50%, white 50%);"></div>`;
        total5 += 0.5;
      }
    });
    html += "</div>";
  }

  html += `</div><br/><p>รวมยาที่ต้องจ่าย:<br/>🔵 3mg ${total3} เม็ด<br/>🟣 5mg ${total5} เม็ด</p>`;
  result.innerHTML = html;
}

function distributeDose(total) {
  const perDay = [];
  let remaining = total;
  for (let i = 0; i < 7; i++) {
    let portion = +(total / 7).toFixed(2);
    let best = [];
    let minDiff = Infinity;
    for (let x = 0; x <= 3; x += 0.5) {
      for (let y = 0; y <= 3; y += 0.5) {
        const dose = x * 3 + y * 5;
        const diff = Math.abs(dose - portion);
        if (diff < minDiff) {
          best = [];
          if (x % 1 === 0.5) best.push(1.5); else for (let k = 0; k < x; k++) best.push(3);
          if (y % 1 === 0.5) best.push(2.5); else for (let k = 0; k < y; k++) best.push(5);
          minDiff = diff;
        }
      }
    }
    perDay.push(best);
  }
  return perDay;
}

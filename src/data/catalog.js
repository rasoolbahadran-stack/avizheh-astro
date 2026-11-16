// منبع واحد دادهٔ آویزه — همان فایل مشترکی که مرورگر هم به‌صورت اسکریپت کلاسیک لود می‌کند.
// در سمت سرور (Node) با globalThis مقداردهی می‌شود و کامپوننت‌ها از همین‌جا می‌خوانند.
import '../vendor_data.js';
import '../vendor_icons.js';

export const AVZ = globalThis.AVZ;
export const icon = globalThis.icon;

/* قالب‌بندی اعداد فارسی — همان الگوریتم utils.js */
const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
export const faNum = (n) => String(n).replace(/\d/g, (d) => FA[+d]);
export const money = (n) => faNum(Math.round(n).toLocaleString('en-US').replace(/,/g, '٬'));
export const priceHtml = (n) => money(n) + ' <small>تومان</small>';

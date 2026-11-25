// =========================================================
// DAFTAR AKUN EXECUTIVE DASHBOARD (MOCKUP)
// ---------------------------------------------------------
// Tambah / ubah akun cukup di file ini.
//   username : dipakai saat login (tidak case-sensitive)
//   password : kata sandi
//   fullName : nama lengkap + gelar, tampil di header kanan atas
//   greeting : nama di sapaan "Selamat datang, ..."
//   role     : jabatan, tampil di bawah nama pada header
//   photo    : path foto di folder public/ (kosongkan "" -> pakai inisial)
//   initials : inisial jika foto tidak ada
//
// CATATAN: ini autentikasi sisi-browser untuk mockup. Password ikut
// terbawa di bundle JavaScript, jadi jangan gunakan password yang
// juga dipakai untuk akun lain (SSO UGM, email, dll).
// =========================================================

export const USERS = [
  {
    username: "triasaditya",
    password: "geodesi1hati",
    fullName: "Prof. Ir. Trias Aditya K.M., S.T., M.Sc., Ph.D., IPU., ASEAN Eng.",
    greeting: "Prof. Trias Aditya",
    role: "Wakil Dekan Fakultas Teknik",
    photo: "/foto_prof_trias3.png",
    initials: "TA",
  },
  {
    username: "sarjiya",
    password: "ftugmjaya1",
    fullName: "Prof. Ir. Sarjiya, S.T., M.T., Ph.D., IPU.",
    greeting: "Prof. Sarjiya",
    role: "Dekan Fakultas Teknik",
    photo: "/foto_prof_sarjiya.jpeg",
    initials: "SJ",
  },
  {
    username: "zudhyirawan",
    password: "ftugmjaya2",
    fullName: "Prof. Dr.Eng. Ir. Muhammad Zudhy Irawan, S.T., M.T., IPM.",
    greeting: "Prof. Zudhy",
    role: "Fakultas Teknik",
    photo: "/foto_prof_zudhy.jfif",
    initials: "ZD",
  },
  {
    username: "rochimbakti",
    password: "ftugmjaya3",
    fullName: "Prof. Ir. Rochim Bakti Cahyono, S.T., M.Sc., Ph.D., IPM.",
    greeting: "Prof. Rochim",
    role: "Fakultas Teknik",
    photo: "",
    initials: "RC",
  },
  {
    username: "aini",
    password: "ftugmjaya4",
    fullName: "Prof. Ir. Nur Aini Masruroh, ST., M.Sc., Ph.D., IPU., ASEAN Eng.",
    greeting: "Prof. Aini",
    role: "Fakultas Teknik",
    photo: "/foto_prof_aini.jfif",
    initials: "AI",
  },
  {
    username: "tamuft",
    password: "tamuftugm",
    fullName: "Tamu",
    greeting: "Tamu",
    role: "Fakultas Teknik",
    photo: "",
    initials: "TF",
  },
];

export function findUser(username, password) {
  const uname = (username || "").trim().toLowerCase();
  return USERS.find((u) => u.username.toLowerCase() === uname && u.password === password) || null;
}

export function getUserByUsername(username) {
  const uname = (username || "").trim().toLowerCase();
  return USERS.find((u) => u.username.toLowerCase() === uname) || null;
}

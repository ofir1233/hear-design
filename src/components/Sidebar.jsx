import { useState, useEffect, useRef } from 'react'
import HearLogo from './HearLogo.jsx'

/* ── Icons ── */
function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}
function DataIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v4c0 1.657 4.03 3 9 3s9-1.343 9-3V5"/>
      <path d="M3 9v4c0 1.657 4.03 3 9 3s9-1.343 9-3V9"/>
      <path d="M3 13v4c0 1.657 4.03 3 9 3s9-1.343 9-3v-4"/>
    </svg>
  )
}
function ReportsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}
function SignalsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.3717 2.6696C12.5268 2.67208 12.669 2.67673 12.7968 2.68718C13.0602 2.70873 13.322 2.75665 13.5741 2.88509C13.9497 3.07645 14.2564 3.38183 14.4485 3.75879C14.5769 4.01087 14.6249 4.27292 14.6464 4.53614C14.6673 4.79166 14.6666 5.10353 14.6666 5.46517V10.5355C14.6666 10.897 14.6673 11.2085 14.6464 11.4639C14.6249 11.7271 14.5769 11.9892 14.4485 12.2412C14.2568 12.6175 13.9504 12.9238 13.5741 13.1156C13.3221 13.244 13.06 13.292 12.7968 13.3135C12.5414 13.3343 12.2299 13.3337 11.8684 13.3337H4.13143C3.76979 13.3337 3.45792 13.3344 3.2024 13.3135C2.93918 13.292 2.67713 13.244 2.42505 13.1156C2.04809 12.9234 1.74271 12.6168 1.55135 12.2412C1.42291 11.9891 1.37499 11.7273 1.35344 11.4639C1.33254 11.2082 1.33325 10.8959 1.33325 10.5335V5.46713C1.33325 5.10475 1.33254 4.79263 1.35344 4.53679C1.37497 4.27327 1.42283 4.01103 1.55135 3.75879C1.74309 3.38255 2.04881 3.07683 2.42505 2.88509C2.67729 2.75657 2.93953 2.70871 3.20305 2.68718C3.45889 2.66628 3.77101 2.667 4.13339 2.667H11.8665L12.3717 2.6696ZM4.13339 4.00033C3.74902 4.00033 3.50074 4.00117 3.31177 4.0166C3.13057 4.03141 3.06344 4.05647 3.03052 4.07325C2.90512 4.13715 2.80341 4.23886 2.73951 4.36426C2.72273 4.39718 2.69767 4.46431 2.68286 4.64551C2.66743 4.83448 2.66659 5.08276 2.66659 5.46713V10.5335C2.66659 10.9179 2.66678 11.1664 2.68221 11.3551C2.69699 11.5358 2.72268 11.6027 2.73951 11.6357C2.80379 11.7619 2.9058 11.8645 3.03052 11.9281C3.06339 11.9448 3.13055 11.9699 3.31112 11.9847C3.49975 12.0001 3.7478 12.0003 4.13143 12.0003H11.8684C12.2518 12.0003 12.4996 12.0001 12.6881 11.9847C12.8683 11.97 12.9357 11.9448 12.9687 11.9281C13.0941 11.8641 13.1971 11.7612 13.261 11.6357C13.2777 11.6028 13.3029 11.5353 13.3176 11.3551C13.333 11.1667 13.3333 10.9189 13.3333 10.5355V5.46517C13.3333 5.08154 13.333 4.83349 13.3176 4.64486C13.3029 4.46429 13.2777 4.39713 13.261 4.36426C13.1974 4.23954 13.0948 4.13753 12.9687 4.07325C12.9356 4.05642 12.8687 4.03073 12.6881 4.01595C12.5937 4.00824 12.4844 4.00434 12.3508 4.00228L11.8665 4.00033H4.13339ZM4.15422 6.23991C4.38994 5.95712 4.81084 5.91894 5.09367 6.15463L7.09367 7.82129C7.24563 7.94795 7.33325 8.13584 7.33326 8.33366C7.33326 8.53149 7.24563 8.71937 7.09367 8.84603L5.09367 10.5127C4.81084 10.7484 4.38994 10.7102 4.15422 10.4274C3.91853 10.1446 3.95671 9.72368 4.2395 9.48796L5.62427 8.33366L4.2395 7.17937C3.95671 6.94365 3.91853 6.52274 4.15422 6.23991ZM11.3333 9.33366C11.7014 9.33366 11.9999 9.63214 11.9999 10.0003C11.9999 10.3685 11.7014 10.667 11.3333 10.667H7.99992C7.63173 10.667 7.33326 10.3685 7.33326 10.0003C7.33326 9.63214 7.63173 9.33366 7.99992 9.33366H11.3333Z" fill="currentColor"/>
    </svg>
  )
}
function AlertsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}
function ComplianceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  )
}
function AgentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.99998 1.33301C11.6819 1.33301 14.6666 4.31778 14.6666 7.99967C14.6666 11.6816 11.6819 14.6663 7.99998 14.6663C6.8048 14.6663 5.68157 14.3506 4.71027 13.7985L3.22524 14.2933C3.22396 14.2937 3.22262 14.2948 3.22133 14.2952C3.07157 14.3452 2.91527 14.3978 2.78383 14.4287C2.66228 14.4573 2.43484 14.5017 2.19139 14.415C1.90829 14.3141 1.68595 14.0906 1.58527 13.8083C1.49849 13.5648 1.54238 13.3375 1.57094 13.2158C1.60123 13.0869 1.65278 12.9344 1.7018 12.7874H1.70115L1.7018 12.7855L1.70441 12.777L2.33722 12.988L1.70506 12.777L2.2005 11.2887C1.64867 10.3176 1.33331 9.19455 1.33331 7.99967C1.33331 4.31778 4.31808 1.33301 7.99998 1.33301ZM7.99998 2.66634C5.05446 2.66634 2.66665 5.05416 2.66665 7.99967C2.66665 8.96973 2.92504 9.87741 3.37628 10.6598L3.37823 10.6631C3.39943 10.6998 3.45112 10.783 3.49217 10.8825L3.52797 10.9867L3.54685 11.0687C3.5625 11.1509 3.56776 11.2342 3.56183 11.3213C3.55178 11.4682 3.5006 11.6072 3.4837 11.6579C3.48334 11.659 3.48277 11.66 3.4824 11.6611L3.05336 12.945L4.34113 12.5166C4.39265 12.4994 4.53141 12.4479 4.67836 12.4378L4.7643 12.4352C4.82085 12.4361 4.87611 12.4424 4.93097 12.4528L5.013 12.4717L5.11717 12.5081C5.21723 12.5494 5.30128 12.6011 5.33982 12.6234C6.12222 13.0746 7.02994 13.333 7.99998 13.333C10.9455 13.333 13.3333 10.9452 13.3333 7.99967C13.3333 5.05416 10.9455 2.66634 7.99998 2.66634ZM7.99998 5.33301C8.36817 5.33301 8.66665 5.63148 8.66665 5.99967V7.33301H9.99998C10.3682 7.33301 10.6666 7.63148 10.6666 7.99967C10.6666 8.36786 10.3682 8.66634 9.99998 8.66634H8.66665V9.99967C8.66665 10.3679 8.36817 10.6663 7.99998 10.6663C7.63179 10.6663 7.33331 10.3679 7.33331 9.99967V8.66634H5.99998C5.63179 8.66634 5.33331 8.36786 5.33331 7.99967C5.33331 7.63148 5.63179 7.33301 5.99998 7.33301H7.33331V5.99967C7.33331 5.63148 7.63179 5.33301 7.99998 5.33301Z" fill="currentColor"/>
    </svg>
  )
}
function KnowledgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  )
}
function AiTaskIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.6666 3.99967C10.6666 3.26329 10.0697 2.66634 9.33331 2.66634C8.59693 2.66634 7.99998 3.26329 7.99998 3.99967C7.99998 4.31439 7.89161 4.62829 7.69594 4.87337C7.49615 5.12357 7.17534 5.333 6.76756 5.33301H5.33331V6.76725C5.33331 7.17503 5.12388 7.49584 4.87368 7.69564C4.6286 7.89131 4.31469 7.99967 3.99998 7.99967C3.2636 7.99967 2.66665 8.59663 2.66665 9.33301C2.66665 10.0694 3.2636 10.6663 3.99998 10.6663C4.31469 10.6663 4.62859 10.7747 4.87368 10.9704C5.12389 11.1702 5.33331 11.491 5.33331 11.8988V13.333H13.3333V11.9997C11.8606 11.9997 10.6666 10.8058 10.6666 9.33301C10.6666 7.86025 11.8606 6.66634 13.3333 6.66634V5.33301H11.8991C11.4913 5.33301 11.1705 5.12358 10.9707 4.87337C10.775 4.62829 10.6666 4.31438 10.6666 3.99967ZM13.3333 3.99967C14.0696 3.99969 14.6666 4.59658 14.6666 5.33301V6.76725L14.6569 6.91569C14.6134 7.25311 14.426 7.52077 14.207 7.69564C13.9619 7.89131 13.648 7.99967 13.3333 7.99967C12.5969 7.99967 12 8.59663 12 9.33301C12 10.0694 12.5969 10.6663 13.3333 10.6663C13.648 10.6663 13.9619 10.7747 14.207 10.9704C14.4572 11.1702 14.6666 11.491 14.6666 11.8988V13.333C14.6666 14.0234 14.1419 14.591 13.4694 14.6592L13.3333 14.6663H5.33331C4.59693 14.6663 3.99998 14.0694 3.99998 13.333V11.9997C2.52722 11.9997 1.33331 10.8058 1.33331 9.33301C1.33331 7.86025 2.52722 6.66634 3.99998 6.66634V5.33301C3.99998 4.59663 4.59693 3.99967 5.33331 3.99967H6.66665C6.66665 2.52692 7.86055 1.33301 9.33331 1.33301C10.8061 1.33301 12 2.52692 12 3.99967H13.3333Z" fill="currentColor"/>
    </svg>
  )
}
function CustomersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}
function BellIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="path-1-inside-1_2243_2210" fill="white">
        <path d="M13.0001 4.2666C13.589 4.26664 14.0663 4.74405 14.0665 5.33301V5.43945C16.501 5.9335 18.3331 8.08667 18.3331 10.667V12.7998C18.3331 14.7878 19.6931 16.4579 21.5333 16.9316V17.0664H4.46686V16.9316C6.24944 16.4727 7.58163 14.8911 7.66315 12.9854L7.66705 12.7998V10.667C7.66705 8.08663 9.49906 5.93345 11.9337 5.43945V5.33301C11.9338 4.74402 12.411 4.2666 13.0001 4.2666Z"/>
      </mask>
      <path d="M13.0001 4.2666C13.589 4.26664 14.0663 4.74405 14.0665 5.33301V5.43945C16.501 5.9335 18.3331 8.08667 18.3331 10.667V12.7998C18.3331 14.7878 19.6931 16.4579 21.5333 16.9316V17.0664H4.46686V16.9316C6.24944 16.4727 7.58163 14.8911 7.66315 12.9854L7.66705 12.7998V10.667C7.66705 8.08663 9.49906 5.93345 11.9337 5.43945V5.33301C11.9338 4.74402 12.411 4.2666 13.0001 4.2666Z" fill="#383838"/>
      <path d="M13.0001 4.2666L13.0002 2.13327H13.0001V4.2666ZM14.0665 5.33301H16.1998V5.3325L14.0665 5.33301ZM14.0665 5.43945H11.9331V7.18335L13.6422 7.53017L14.0665 5.43945ZM18.3331 12.7998H16.1997V12.7998L18.3331 12.7998ZM21.5333 16.9316H23.6666V15.2779L22.0651 14.8657L21.5333 16.9316ZM21.5333 17.0664V19.1997H23.6666V17.0664H21.5333ZM4.46686 17.0664H2.33352V19.1997H4.46686V17.0664ZM4.46686 16.9316L3.93495 14.8657L2.33352 15.278V16.9316H4.46686ZM7.66315 12.9854L9.79453 13.0765L9.79552 13.0534L9.79601 13.0303L7.66315 12.9854ZM7.66705 12.7998L9.79991 12.8447L9.80039 12.8223V12.7998H7.66705ZM11.9337 5.43945L12.3579 7.53018L14.067 7.18339V5.43945H11.9337ZM11.9337 5.33301L9.80032 5.33249V5.33301H11.9337ZM13.0001 4.2666L12.9999 6.39994C12.4104 6.3999 11.9333 5.92198 11.9331 5.33352L14.0665 5.33301L16.1998 5.3325C16.1994 3.56611 14.7677 2.13337 13.0002 2.13327L13.0001 4.2666ZM14.0665 5.33301H11.9331V5.43945H14.0665H16.1998V5.33301H14.0665ZM14.0665 5.43945L13.6422 7.53017C15.1014 7.82629 16.1997 9.12067 16.1997 10.667H18.3331H20.4664C20.4664 7.05267 17.9006 4.0407 14.4907 3.34873L14.0665 5.43945ZM18.3331 10.667H16.1997V12.7998H18.3331H20.4664V10.667H18.3331ZM18.3331 12.7998L16.1997 12.7998C16.1998 15.7852 18.2422 18.2873 21.0014 18.9976L21.5333 16.9316L22.0651 14.8657C21.1441 14.6286 20.4664 13.7904 20.4664 12.7998L18.3331 12.7998ZM21.5333 16.9316H19.3999V17.0664H21.5333H23.6666V16.9316H21.5333ZM21.5333 17.0664V14.9331H4.46686V17.0664V19.1997H21.5333V17.0664ZM4.46686 17.0664H6.60019V16.9316H4.46686H2.33352V17.0664H4.46686ZM4.46686 16.9316L4.99877 18.9976C7.67201 18.3093 9.67203 15.9406 9.79453 13.0765L7.66315 12.9854L5.53176 12.8942C5.49124 13.8417 4.82687 14.636 3.93495 14.8657L4.46686 16.9316ZM7.66315 12.9854L9.79601 13.0303L9.79991 12.8447L7.66705 12.7998L5.53419 12.7549L5.53029 12.9404L7.66315 12.9854ZM7.66705 12.7998H9.80039V10.667H7.66705H5.53372V12.7998H7.66705ZM7.66705 10.667H9.80039C9.80039 9.12058 10.8987 7.82626 12.3579 7.53018L11.9337 5.43945L11.5094 3.34872C8.09943 4.04064 5.53372 7.05267 5.53372 10.667H7.66705ZM11.9337 5.43945H14.067V5.33301H11.9337H9.80032V5.43945H11.9337ZM11.9337 5.33301L14.067 5.33352C14.0668 5.92183 13.5898 6.39994 13.0001 6.39994V4.2666V2.13327C11.2323 2.13327 9.80075 3.56622 9.80032 5.33249L11.9337 5.33301Z" fill="#383838" mask="url(#path-1-inside-1_2243_2210)"/>
      <mask id="path-3-inside-2_2243_2210" fill="white">
        <path d="M21.5333 17.0669C21.5333 18.2451 20.5782 19.2002 19.4 19.2002L6.59999 19.2002C5.42178 19.2002 4.46666 18.2451 4.46666 17.0669L21.5333 17.0669Z"/>
      </mask>
      <path d="M21.5333 17.0669C21.5333 18.2451 20.5782 19.2002 19.4 19.2002L6.59999 19.2002C5.42178 19.2002 4.46666 18.2451 4.46666 17.0669L21.5333 17.0669Z" fill="#383838"/>
      <path d="M4.46666 17.0669L4.46666 14.9335L2.33332 14.9335L2.33332 17.0669L4.46666 17.0669ZM21.5333 17.0669L23.6667 17.0669L23.6667 14.9335L21.5333 14.9335L21.5333 17.0669ZM19.4 19.2002L19.4 17.0669L6.59999 17.0669L6.59999 19.2002L6.59999 21.3335L19.4 21.3335L19.4 19.2002ZM4.46666 17.0669L4.46666 19.2002L21.5333 19.2002L21.5333 17.0669L21.5333 14.9335L4.46666 14.9335L4.46666 17.0669ZM6.59999 19.2002L6.59999 17.0669L6.59999 17.0669L4.46666 17.0669L2.33332 17.0669C2.33332 19.4233 4.24358 21.3335 6.59999 21.3335L6.59999 19.2002ZM19.4 19.2002L19.4 21.3335C21.7564 21.3335 23.6667 19.4233 23.6667 17.0669L21.5333 17.0669L19.4 17.0669L19.4 17.0669L19.4 19.2002Z" fill="#383838" mask="url(#path-3-inside-2_2243_2210)"/>
      <mask id="path-5-inside-3_2243_2210" fill="white">
        <path d="M15.1334 20.2671C15.1334 21.4453 14.1782 22.4004 13 22.4004C11.8218 22.4004 10.8667 21.4453 10.8667 20.2671L15.1334 20.2671Z"/>
      </mask>
      <path d="M15.1334 20.2671C15.1334 21.4453 14.1782 22.4004 13 22.4004C11.8218 22.4004 10.8667 21.4453 10.8667 20.2671L15.1334 20.2671Z" fill="#383838"/>
      <path d="M10.8667 20.2671L10.8667 18.1337L8.73336 18.1337L8.73336 20.2671L10.8667 20.2671ZM15.1334 20.2671L17.2667 20.2671L17.2667 18.1337L15.1334 18.1337L15.1334 20.2671ZM10.8667 20.2671L10.8667 22.4004L15.1334 22.4004L15.1334 20.2671L15.1334 18.1337L10.8667 18.1337L10.8667 20.2671ZM13 22.4004L13 20.2671L13 20.2671L10.8667 20.2671L8.73336 20.2671C8.73336 22.6235 10.6436 24.5337 13 24.5337L13 22.4004ZM13 22.4004L13 24.5337C15.3564 24.5337 17.2667 22.6235 17.2667 20.2671L15.1334 20.2671L13 20.2671L13 20.2671L13 22.4004Z" fill="#383838" mask="url(#path-5-inside-3_2243_2210)"/>
    </svg>
  )
}
function ChevronIcon({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M21.9978 14.909C21.0547 16.5395 19.2918 17.6366 17.2727 17.6366C14.2602 17.6366 11.8182 15.1945 11.8182 12.1821C11.8182 10.163 12.9152 8.40009 14.5458 7.45703C10.613 7.55332 7.45453 10.7716 7.45453 14.7275C7.45453 18.7442 10.7106 22.0003 14.7273 22.0003C18.6832 22.0003 21.9015 18.8418 21.9978 14.909Z" fill="#A6A6A6"/>
    </svg>
  )
}
function AccessibilityIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M13.6534 8.23228C12.2142 7.93754 10.8316 8.96106 10.62 10.478L10.2128 13.3961C10.3617 13.3845 10.5125 13.3731 10.6595 13.362C10.867 13.3463 11.0683 13.3311 11.249 13.3164C11.5022 13.2958 11.7218 13.5043 11.7218 13.7698C11.7218 13.9987 11.5567 14.1901 11.3384 14.2082C11.1419 14.2244 10.9152 14.2412 10.6802 14.2587C10.094 14.3022 9.45587 14.3497 9.10585 14.4009L9.09459 14.4026C9.08611 14.4039 9.07773 14.4054 9.06944 14.4071C8.99542 14.4229 8.92935 14.4581 8.87548 14.5069L8.86577 14.5158C8.7655 14.6122 8.71087 14.7569 8.73159 14.9085C8.765 15.153 8.9817 15.3229 9.21559 15.2879C13.7157 14.616 18.2843 14.616 22.7843 15.2879C23.0182 15.3229 23.2349 15.153 23.2683 14.9085C23.3017 14.664 23.1392 14.4375 22.9053 14.4026L22.8854 14.3996C22.5335 14.3489 21.9011 14.3019 21.3199 14.2587C21.0849 14.2412 20.8582 14.2244 20.6618 14.2082C20.4434 14.1901 20.2784 13.9987 20.2784 13.7698C20.2784 13.5043 20.498 13.2958 20.7512 13.3164C20.9319 13.3311 21.133 13.3463 21.3406 13.362C21.4875 13.3731 21.6382 13.3845 21.787 13.3961L21.3798 10.478C21.1682 8.96106 19.7857 7.93754 18.3464 8.23228L16.3289 8.64542C16.1116 8.68992 15.8882 8.68992 15.6709 8.64542L13.6534 8.23228ZM14.2891 19.3169C14.2891 20.3047 13.523 21.1055 12.5779 21.1055C11.6328 21.1055 10.8667 20.3047 10.8667 19.3169C10.8667 18.329 11.6328 17.5282 12.5779 17.5282C13.523 17.5282 14.2891 18.329 14.2891 19.3169ZM14.8812 18.1313C14.9614 18.3013 15.1199 18.4225 15.3012 18.4225H16.6995C16.8808 18.4225 17.0393 18.3013 17.1195 18.1313C17.5382 17.2442 18.4123 16.6339 19.4228 16.6339C20.8404 16.6339 21.9896 17.8351 21.9896 19.3169C21.9896 20.7986 20.8404 21.9998 19.4228 21.9998C18.1503 21.9998 17.0941 21.032 16.8911 19.7621C16.8522 19.5186 16.6644 19.3169 16.4281 19.3169H15.5725C15.3363 19.3169 15.1485 19.5186 15.1095 19.7621C14.9066 21.032 13.8504 21.9998 12.5779 21.9998C11.1603 21.9998 10.0111 20.7986 10.0111 19.3169C10.0111 17.8351 11.1603 16.6339 12.5779 16.6339C13.5883 16.6339 14.4624 17.2442 14.8812 18.1313ZM19.4228 21.1055C18.4777 21.1055 17.7115 20.3047 17.7115 19.3169C17.7115 18.329 18.4777 17.5282 19.4228 17.5282C20.3678 17.5282 21.134 18.329 21.134 19.3169C21.134 20.3047 20.3678 21.1055 19.4228 21.1055Z" fill="#A6A6A6"/>
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M17.728 20.0908C17.728 20.4923 17.4019 20.8181 17.0004 20.8184L12.6371 20.8184C11.4323 20.8184 10.4547 19.8416 10.4545 18.6367L10.4545 11.3633C10.4548 10.1585 11.4323 9.18164 12.6371 9.18164L17.0004 9.18164C17.4019 9.18188 17.728 9.50767 17.728 9.90918C17.728 10.3107 17.4019 10.6365 17.0004 10.6367L12.6371 10.6367C12.2356 10.6367 11.9098 10.9618 11.9096 11.3633L11.9096 18.6367C11.9098 19.0383 12.2356 19.3633 12.6371 19.3633L17.0004 19.3633C17.4018 19.3635 17.7279 19.6894 17.728 20.0908Z" fill="#A6A6A6"/>
      <rect x="21.0909" y="14" width="1.45455" height="6.54545" rx="0.727273" transform="rotate(90 21.0909 14)" fill="#A6A6A6"/>
      <path d="M18.9091 12.5459L21.0909 14.7277L18.9091 16.9095" stroke="#A6A6A6" strokeWidth="1.45455" strokeLinecap="round"/>
    </svg>
  )
}
function DotsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
    </svg>
  )
}
function CollapseArrow({ collapsed }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 250ms ease' }}>
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',        Icon: HomeIcon       },
  { id: 'data',        label: 'Data',              Icon: DataIcon       },
  { id: 'reports',     label: 'Reports',           Icon: ReportsIcon    },
  { id: 'signals',     label: 'Signals',           Icon: SignalsIcon    },
  { id: 'alerts',      label: 'Alerts',            Icon: AlertsIcon     },
  { id: 'compliance',  label: 'Compliance',        Icon: ComplianceIcon },
  { id: 'agent-eval',  label: 'Agent evaluation',  Icon: AgentIcon      },
  { id: 'knowledge',   label: 'Knowledge',         Icon: KnowledgeIcon  },
  { id: 'ai-task',     label: 'Ai task',           Icon: AiTaskIcon     },
  { id: 'customers',   label: 'Customers',         Icon: CustomersIcon  },
  { id: 'settings',    label: 'Settings',          Icon: SettingsIcon   },
]

const HISTORY_ITEMS = [
  { id: 1, label: 'Improving on average handle...',       active: false },
  { id: 2, label: 'Another conversation about bad...',    active: false },
  { id: 3, label: 'Reasons for bad handling time',        active: false },
  { id: 4, label: 'Something else that has somethi...',   active: false },
]

const PROJECTS = [
  { id: 1, label: 'Acme Corp' },
  { id: 2, label: 'Beta Industries' },
  { id: 3, label: 'Gamma Solutions' },
]

export default function Sidebar({ isMobile = false, mobileOpen = false, onMobileClose }) {
  const [collapsed, setCollapsed]       = useState(false)
  const [activeNav, setActiveNav]       = useState('dashboard')
  const [historyOpen, setHistoryOpen]   = useState(true)
  const [hoveredHistory, setHoveredHistory] = useState(null)
  const [projectOpen, setProjectOpen]   = useState(false)
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0])
  const projectRef = useRef(null)

  useEffect(() => {
    if (!projectOpen) return
    function handleClick(e) {
      if (projectRef.current && !projectRef.current.contains(e.target)) {
        setProjectOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [projectOpen])

  const isOpen = isMobile ? mobileOpen : !collapsed

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 99,
          }}
        />
      )}

    <div style={{ display: 'flex', alignItems: 'stretch', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>

      {/* Sidebar panel */}
      <div
        style={{
          width: isOpen ? 272 : 0,
          overflow: 'hidden',
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          background: '#f5f5f3',
          borderRight: '1px solid #e5e7eb',
          height: '100vh',
        }}
      >
        <div style={{ position: 'relative', width: 272, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={onMobileClose}
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 32, height: 32,
                background: 'transparent',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6b7280',
                fontSize: 20,
                lineHeight: 1,
              }}
            >×</button>
          )}

          {/* Logo */}
          <div style={{ padding: '24px 20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <img src="/hear-logo.svg" alt="Hear" style={{ height: 34 }} />
            <img src="/powered-by-hear.svg" alt="Powered by Hear" style={{ height: 17, opacity: 0.7 }} />
          </div>

          {/* Project selector + bell */}
          <div style={{ padding: '0 24px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div ref={projectRef} style={{ flex: 1, position: 'relative' }}>
              <div
                onClick={() => setProjectOpen(o => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 40,
                  padding: '0 12px',
                  background: 'transparent',
                  border: '1.5px solid #c4c4c4',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: '#374151',
                  userSelect: 'none',
                }}
              >
                <span>{selectedProject.label}</span>
                <ChevronIcon open={projectOpen} />
              </div>
              {projectOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  zIndex: 200,
                  overflow: 'hidden',
                }}>
                  {PROJECTS.map(project => (
                    <div
                      key={project.id}
                      onClick={() => { setSelectedProject(project); setProjectOpen(false) }}
                      style={{
                        padding: '9px 12px',
                        fontSize: 13,
                        color: project.id === selectedProject.id ? '#111827' : '#374151',
                        fontWeight: project.id === selectedProject.id ? 600 : 400,
                        background: project.id === selectedProject.id ? '#f3f4f6' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 120ms ease',
                      }}
                      onMouseEnter={e => { if (project.id !== selectedProject.id) e.currentTarget.style.background = '#f9fafb' }}
                      onMouseLeave={e => { if (project.id !== selectedProject.id) e.currentTarget.style.background = 'transparent' }}
                    >
                      {project.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button style={{
                position: 'relative',
                width: 40, height: 40,
                background: 'transparent',
                border: '1.5px solid #c4c4c4',
                borderRadius: 9.6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <BellIcon />
                <span style={{
                  position: 'absolute', top: 4, right: 4,
                  background: '#E8613A',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  width: 16, height: 16,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  outline: '2px solid #f5f5f3',
                }}>7</span>
              </button>
            </div>
          </div>

          <div style={{ height: 1, background: '#e5e7eb', margin: '0 24px 8px' }} />

          {/* Nav items */}
          <nav style={{ padding: '0 24px', flex: 1 }}>
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const active = activeNav === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: active ? '#e8e8e6' : 'transparent',
                    color: active ? '#111827' : '#6b7280',
                    fontSize: 13.5,
                    fontWeight: 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: 1,
                    transition: 'background 150ms ease, color 150ms ease',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#ebebea' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon />
                  {label}
                </button>
              )
            })}
          </nav>

          {/* ── Storybook Dev Link ──────────────────────────────────────────────── */}
          <div style={{ padding: '6px 24px 4px' }}>
            <a
              href={window.location.hostname === 'localhost' ? 'http://localhost:6007' : '/storybook/'}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.01em',
                boxShadow: '0 1px 3px rgba(124,58,237,0.35)',
                transition: 'opacity 150ms ease, box-shadow 150ms ease',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.88'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(124,58,237,0.50)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(124,58,237,0.35)'
              }}
            >
              {/* Hear logo — replaces default Storybook book icon */}
              <svg
                width="18" height="16" viewBox="0 0 69 60" fill="none"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path d="M63.6202 25.6905C66.431 26.6546 69 26.1754 69 28.5414C69 30.9074 65.4639 29.2245 61.4139 32.459C57.364 35.6935 56.1551 40.0061 53.4954 45.4868C50.8357 50.9675 46.5138 61.4496 39.1091 59.8324C31.7043 58.2151 34.2129 46.1157 34.0618 41.1741C33.9106 36.2325 33.2457 32.5189 29.2865 32.0696C25.3272 31.6204 23.0302 34.6153 20.7332 38.2391C18.4363 41.863 16.502 49.3802 11.0315 47.7629C5.5611 46.1457 9.3088 36.1726 7.46518 33.2077C5.62155 30.2427 3.17346 30.1886 2.29698 30.1886C1.4205 30.1886 8.16629e-06 29.7394 0 28.5714C-8.16629e-06 27.4033 1.26938 27.0739 2.29698 27.0739C3.32457 27.0739 4.60326 27.2375 7.19317 26.5291C13.6307 24.7681 12.8147 11.2251 20.1288 11.5845C27.0146 11.9229 23.4533 26.0798 30.0118 26.0798C36.5703 26.0798 38.7464 18.5027 41.4665 12.8424C44.1866 7.18205 49.4152 -1.32349 56.1551 0.173941C62.8949 1.67137 60.5677 14.1302 60.1445 18.0535C59.7214 21.9768 60.8095 24.7264 63.6202 25.6905Z" fill="white"/>
              </svg>
              <span style={{ flex: 1 }}>Storybook</span>
              {/* DEV badge */}
              <span style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '2px 5px',
                borderRadius: 4,
                background: 'rgba(255,255,255,0.20)',
                border: '1px solid rgba(255,255,255,0.35)',
                color: '#fff',
                lineHeight: 1.4,
                flexShrink: 0,
              }}>
                DEV
              </span>
            </a>
          </div>
          {/* ── end Storybook Dev Link ─────────────────────────────────────────── */}

          <div style={{ height: 1, background: '#e5e7eb', margin: '8px 24px' }} />

          {/* History section */}
          <div style={{ padding: '0 24px 8px' }}>
            <button
              onClick={() => setHistoryOpen(o => !o)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              History
              <ChevronIcon open={historyOpen} />
            </button>

            {historyOpen && HISTORY_ITEMS.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredHistory(item.id)}
                onMouseLeave={() => setHoveredHistory(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 12px',
                  borderRadius: 8,
                  background: item.active ? '#fde8e8' : hoveredHistory === item.id ? '#ebebea' : 'transparent',
                  cursor: 'pointer',
                  marginBottom: 1,
                  transition: 'background 150ms ease',
                }}
              >
                <span style={{
                  fontSize: 13,
                  color: item.active ? '#b91c1c' : '#374151',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {item.label}
                </span>
                {(item.active || hoveredHistory === item.id) && (
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: item.active ? '#b91c1c' : '#9ca3af',
                    padding: '0 0 0 6px',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}>
                    <DotsIcon />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Footer */}
          <div style={{ padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* User row — pill container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: 16,
              background: '#fff',
            }}>
              <div style={{
                width: 24, height: 24,
                borderRadius: '50%',
                background: '#e05252',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9,
                fontWeight: 700,
                flexShrink: 0,
                outline: '2px solid rgba(0,0,0,0.20)',
              }}>RG</div>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#111827' }}>John Smith</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 6,
                fontSize: 12,
                color: '#374151',
                cursor: 'pointer',
                flexShrink: 0,
              }}>
                HE <ChevronIcon open={false} />
              </div>
            </div>

            {/* Bottom action icons with dividers */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[MoonIcon, AccessibilityIcon, LogoutIcon].map((Icon, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {i > 0 && <div style={{ width: 1, height: 20, background: '#e0e0e0', flexShrink: 0 }} />}
                  <button
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      padding: '6px 0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'color 150ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#374151' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af' }}
                  >
                    <Icon />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Collapse tab — desktop only */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            alignSelf: 'center',
            width: 20,
            height: 48,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderLeft: 'none',
            borderRadius: '0 8px 8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#9ca3af',
            flexShrink: 0,
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <CollapseArrow collapsed={!collapsed} />
        </button>
      )}
    </div>
    </>
  )
}

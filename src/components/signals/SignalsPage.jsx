import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

function navigate(path, state = {}) {
  window.history.pushState(state, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
import { AgGridReact } from 'ag-grid-react'
import {
  ModuleRegistry, AllCommunityModule,
  themeQuartz, colorSchemeDark, colorSchemeLight,
} from 'ag-grid-community'
import Badge from '../Badge.jsx'
import Button from '../Button.jsx'

ModuleRegistry.registerModules([AllCommunityModule])

// ── AG Grid themes (mirrors DataPage) ────────────────────────────────────────
const THEME_PARAMS = {
  fontFamily: "'Byrd', sans-serif",
  fontSize: 13,
  cellHorizontalPaddingScale: 1.1,
  wrapperBorderRadius: 0,
}
const lightTheme = themeQuartz.withPart(colorSchemeLight).withParams({
  ...THEME_PARAMS,
  backgroundColor:            '#FFFFFF',
  foregroundColor:            '#181818',
  headerBackgroundColor:      '#FFFFFF',
  headerTextColor:            '#606060',
  borderColor:                '#E5E7EB',
  rowHoverColor:              '#E8E8E6',
  selectedRowBackgroundColor: 'rgba(23,121,247,0.07)',
  oddRowBackgroundColor:      '#FFFFFF',
  headerColumnResizeHandleColor: '#D1D5DB',
})
const darkTheme = themeQuartz.withPart(colorSchemeDark).withParams({
  ...THEME_PARAMS,
  backgroundColor:            '#242424',
  foregroundColor:            '#F4F3F1',
  headerBackgroundColor:      '#181818',
  headerTextColor:            '#9B9B9B',
  borderColor:                '#333333',
  rowHoverColor:              '#2A2A2A',
  selectedRowBackgroundColor: 'rgba(23,121,247,0.12)',
  oddRowBackgroundColor:      '#242424',
  headerColumnResizeHandleColor: '#444444',
})

// ── Icons ─────────────────────────────────────────────────────────────────────
function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function MoreIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="3"   r="1.2" fill="currentColor" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
      <circle cx="7.5" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.8" fill="currentColor" />
    </svg>
  )
}
function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1.5L2 3.5v3c0 2.8 2 4.7 4.5 5.5C9 11.2 11 9.3 11 6.5v-3L6.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}
function RunRevisionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM10 8.93359C10.0006 8.53491 10.4453 8.29668 10.7773 8.51758L15.376 11.584C15.6726 11.7819 15.6726 12.2181 15.376 12.416L10.7773 15.4814C10.4452 15.7028 10.0002 15.4646 10 15.0654V8.93359Z" fill="currentColor"/>
    </svg>
  )
}
function ExportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M17 9C17.4521 9 17.8413 8.99961 18.1621 9.02148C18.4919 9.04399 18.8225 9.09351 19.1484 9.22852C19.8836 9.53317 20.4672 10.1179 20.7715 10.8525C20.9064 11.1783 20.956 11.5081 20.9785 11.8379C21.0004 12.1587 21 12.5478 21 13V17.8027C21 18.345 21.001 18.8122 20.9697 19.1953C20.9374 19.5902 20.8655 19.9832 20.6729 20.3613C20.3855 20.9253 19.9269 21.3851 19.3623 21.6729C18.9843 21.8655 18.5911 21.9374 18.1963 21.9697C17.8132 22.0011 17.3461 22 16.8037 22H7.19727C6.65481 22 6.187 22.001 5.80372 21.9697C5.40889 21.9374 5.01581 21.8655 4.6377 21.6729C4.07245 21.3848 3.61428 20.9249 3.32715 20.3613C3.13451 19.9832 3.0626 19.5904 3.03028 19.1953C2.99893 18.8117 3 18.3433 3 17.7998V13C3 12.5478 2.99961 12.1587 3.02149 11.8379C3.04399 11.5082 3.09361 11.1784 3.22852 10.8525C3.533 10.1175 4.11746 9.533 4.85254 9.22852C5.17839 9.09359 5.50815 9.04398 5.8379 9.02148C6.15868 8.9996 6.54786 9 7 9C7.55229 9 8 9.44772 8 10C8 10.5523 7.55229 11 7 11C6.52052 11 6.21058 11.0004 5.97364 11.0166C5.74591 11.0322 5.65878 11.0589 5.61719 11.0762C5.37243 11.1777 5.17766 11.3724 5.07618 11.6172C5.05893 11.6588 5.03216 11.7459 5.01661 11.9736C5.00044 12.2105 5 12.5204 5 13V17.7998C5 18.3764 5.00029 18.749 5.02344 19.0322C5.0456 19.3031 5.08417 19.4036 5.10938 19.4531C5.2057 19.6422 5.35862 19.7962 5.5459 19.8916C5.59521 19.9167 5.69595 19.9544 5.9668 19.9766C6.24974 19.9997 6.62183 20 7.19727 20H16.8037C17.3791 20 17.7505 19.9997 18.0332 19.9766C18.3042 19.9544 18.4048 19.9167 18.4541 19.8916C18.642 19.7959 18.7956 19.6416 18.8916 19.4531C18.9167 19.4037 18.9545 19.303 18.9766 19.0332C18.9997 18.7504 19 18.3782 19 17.8027V13C19 12.5204 18.9996 12.2105 18.9834 11.9736C18.9678 11.746 18.9411 11.6589 18.9238 11.6172C18.8222 11.372 18.6274 11.1775 18.3828 11.0762C18.3412 11.0589 18.2543 11.0322 18.0264 11.0166C17.7894 11.0004 17.4796 11 17 11C16.4477 11 16 10.5523 16 10C16 9.44772 16.4477 9 17 9ZM12 2C12.2652 2 12.5195 2.10544 12.707 2.29297L15.707 5.29297C16.0976 5.68349 16.0976 6.31651 15.707 6.70703C15.3165 7.09755 14.6835 7.09755 14.293 6.70703L13 5.41406V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V5.41406L9.70704 6.70703C9.31651 7.09755 8.6835 7.09755 8.29297 6.70703C7.90245 6.31651 7.90245 5.68349 8.29297 5.29297L11.293 2.29297L11.3662 2.22656C11.5442 2.08073 11.7679 2 12 2Z" fill="currentColor"/>
    </svg>
  )
}
function CloneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M11.7998 8C12.3433 8 12.8117 7.99893 13.1953 8.03028C13.5906 8.06259 13.984 8.13442 14.3623 8.32715C14.926 8.61445 15.385 9.0729 15.6729 9.6377C15.8655 10.0158 15.9375 10.4089 15.9697 10.8037C16.0011 11.187 16 11.6548 16 12.1973V17.8027C16 18.345 16.001 18.8123 15.9697 19.1953C15.9374 19.5902 15.8655 19.9832 15.6729 20.3613C15.3855 20.9253 14.9269 21.3851 14.3623 21.6729C13.9843 21.8655 13.5911 21.9374 13.1963 21.9697C12.8132 22.0011 12.3461 22 11.8037 22H6.19727C5.65481 22 5.187 22.0011 4.80372 21.9697C4.40889 21.9375 4.01581 21.8655 3.6377 21.6729C3.07291 21.385 2.61446 20.926 2.32715 20.3623C2.13441 19.984 2.06259 19.5906 2.03028 19.1953C2.0146 19.0035 2.00763 18.7904 2.00391 18.5576L2 17.7998V12.2002C2 11.6566 1.99893 11.1884 2.03028 10.8047C2.06258 10.4094 2.13437 10.016 2.32715 9.6377C2.61475 9.07334 3.07334 8.61475 3.6377 8.32715C4.01605 8.13437 4.40942 8.06258 4.80469 8.03028C5.18845 7.99893 5.65664 8 6.2002 8H11.7998ZM6.2002 10C5.62366 10 5.25123 10.0013 4.96778 10.0244C4.69598 10.0466 4.59528 10.0842 4.5459 10.1094C4.3578 10.2052 4.20524 10.3578 4.10938 10.5459C4.08422 10.5953 4.04662 10.696 4.02442 10.9678C4.00127 11.2512 4 11.6237 4 12.2002V17.7998L4.00293 18.5264C4.00602 18.7268 4.01285 18.8906 4.02442 19.0322C4.04661 19.3037 4.08417 19.4046 4.10938 19.4541C4.20555 19.6427 4.35841 19.7961 4.5459 19.8916C4.5952 19.9167 4.69595 19.9544 4.9668 19.9766C5.24974 19.9997 5.62183 20 6.19727 20H11.8037C12.3791 20 12.7505 19.9997 13.0332 19.9766C13.3042 19.9544 13.4048 19.9167 13.4541 19.8916C13.642 19.7959 13.7956 19.6416 13.8916 19.4531C13.9167 19.4037 13.9545 19.303 13.9766 19.0332C13.9997 18.7504 14 18.3782 14 17.8027V12.1973C14 11.6218 13.9997 11.2497 13.9766 10.9668C13.9544 10.696 13.9167 10.5952 13.8916 10.5459C13.7961 10.3584 13.6427 10.2055 13.4541 10.1094C13.4046 10.0842 13.3037 10.0466 13.0322 10.0244C12.749 10.0013 12.3764 10 11.7998 10H6.2002ZM17.7998 2C18.3434 2 18.8117 1.99893 19.1953 2.03028C19.5906 2.06259 19.984 2.13442 20.3623 2.32715C20.926 2.61445 21.385 3.0729 21.6729 3.6377C21.8656 4.01606 21.9374 4.40937 21.9697 4.80469C22.0011 5.18836 22 5.65665 22 6.2002V11.7998C22 12.3434 22.0011 12.8116 21.9697 13.1953C21.9374 13.5904 21.8655 13.9832 21.6729 14.3613C21.3851 14.926 20.9256 15.3853 20.3613 15.6729C19.9832 15.8655 19.5902 15.9374 19.1953 15.9697C19.1325 15.9749 19.0675 15.9791 19.0003 15.9826C18.4485 16.0112 18 15.5509 18 14.9984C18 14.4464 18.4484 14.0195 18.9989 13.9792C19.0105 13.9784 19.0219 13.9775 19.0332 13.9766C19.303 13.9545 19.4037 13.9167 19.4531 13.8916C19.6415 13.7956 19.7958 13.642 19.8916 13.4541C19.9168 13.4047 19.9544 13.3037 19.9766 13.0322C19.9997 12.7489 20 12.3764 20 11.7998V6.2002C20 5.62377 19.9997 5.25109 19.9766 4.96778C19.9544 4.69656 19.9168 4.59543 19.8916 4.5459C19.7961 4.35842 19.6427 4.20555 19.4541 4.10938C19.4046 4.08417 19.3037 4.04661 19.0322 4.02442C18.749 4.00127 18.3764 4 17.7998 4H12.2002C11.6237 4 11.2512 4.00127 10.9678 4.02442C10.696 4.04662 10.5953 4.08422 10.5459 4.10938C10.3578 4.20524 10.2052 4.3578 10.1094 4.5459C10.0842 4.59528 10.0466 4.69598 10.0244 4.96778C10.0235 4.97888 10.0226 4.99012 10.0218 5.00151C9.98131 5.55186 9.55363 6 9.0018 6C8.44932 6 7.98885 5.55149 8.01744 4.99976C8.02092 4.9325 8.02515 4.86747 8.03028 4.80469C8.06258 4.40942 8.13437 4.01605 8.32715 3.6377C8.61475 3.07334 9.07334 2.61475 9.6377 2.32715C10.016 2.13437 10.4094 2.06258 10.8047 2.03028C11.1884 1.99893 11.6566 2 12.2002 2H17.7998Z" fill="currentColor"/>
    </svg>
  )
}
function TalkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 3C11.7953 3 14.2072 4.63886 15.3291 7.00781C19.0424 7.17967 21.999 10.2444 21.999 14C21.999 15.1991 21.694 16.329 21.1602 17.3184L21.4434 18.166C21.5185 18.3914 21.5972 18.6257 21.6436 18.8232C21.6865 19.0063 21.7523 19.3478 21.6221 19.7129C21.472 20.1337 21.1412 20.4697 20.7139 20.6221C20.3482 20.7524 20.0065 20.6864 19.8242 20.6436C19.627 20.5972 19.3926 20.5182 19.168 20.4434V20.4424H19.166L18.3232 20.1611C17.334 20.6958 16.2015 21 15 21C12.203 20.9999 9.79214 19.3597 8.6709 16.9912C7.59157 16.9411 6.57455 16.6469 5.67578 16.1611L4.83398 16.4424C4.82929 16.4439 4.82405 16.4448 4.81934 16.4463C4.81339 16.4483 4.80772 16.4511 4.80176 16.4531L4.80078 16.4521C4.58584 16.5238 4.36361 16.5992 4.1748 16.6436C3.99249 16.6863 3.65176 16.7521 3.28711 16.6221C2.86464 16.4714 2.52971 16.1384 2.37793 15.7129C2.24762 15.3475 2.31358 15.0057 2.35645 14.8232C2.40276 14.6262 2.48183 14.3924 2.55664 14.168L2.56445 14.1445L2.83887 13.3232C2.30419 12.3337 2 11.2014 2 10C2 6.13401 5.13401 3 9 3ZM15.9385 9.08887C15.9773 9.38721 16 9.69109 16 10C16 13.2331 13.808 15.9513 10.8291 16.7559C11.7246 18.1083 13.2584 19 15 19C15.9851 19 16.901 18.7159 17.6738 18.2256L17.7715 18.1709C18.0054 18.0568 18.2767 18.0379 18.5264 18.1211L19.4189 18.418L19.1221 17.5264C19.0295 17.2486 19.0627 16.944 19.2139 16.6934L19.3486 16.4688C19.7624 15.7418 19.999 14.9005 19.999 14C19.999 11.5593 18.251 9.52814 15.9385 9.08887ZM9 5C6.23858 5 4 7.23858 4 10C4 10.9854 4.28421 11.9011 4.77441 12.6738C4.93549 12.9277 4.97398 13.2411 4.87891 13.5264L4.58008 14.418L5.47363 14.1211C5.75884 14.0261 6.07233 14.0645 6.32617 14.2256C7.09889 14.7158 8.01473 15 9 15C9.09479 15 9.18893 14.9974 9.28223 14.9922C11.9117 14.8461 14 12.6665 14 10C14 7.23858 11.7614 5 9 5Z" fill="currentColor"/>
    </svg>
  )
}
function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 21C16.9705 21 21 16.9706 21 12C21 7.02944 16.9705 3 12 3C7.02941 3 2.99997 7.02944 2.99997 12M2.99997 12L6.49997 9.97927M2.99997 12L0.979248 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 21C9.10067 21 6.52155 19.629 4.87555 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 8.5V13.5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function ViewIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12.0005 5C15.8236 5.00014 19.0645 7.71439 20.8118 9.51172C21.2444 9.95675 21.6482 10.349 21.8754 11.0693C21.9704 11.3705 22 11.7149 22 12C22 12.2851 21.9704 12.6295 21.8754 12.9307C21.6482 13.651 21.2443 14.0434 20.8118 14.4883C19.0644 16.2856 15.8236 18.9999 12.0005 19C8.17707 19 4.93464 16.2857 3.1873 14.4883C2.75426 14.0428 2.35177 13.6511 2.12458 12.9307C2.02963 12.6295 2 12.2851 2 12C2 11.7149 2.02964 11.3705 2.12458 11.0693C2.35175 10.349 2.75419 9.95724 3.1873 9.51172C4.93464 7.71428 8.17707 5 12.0005 5ZM12.0005 7C8.99948 7 6.24225 9.19005 4.55014 10.9307C4.07585 11.4186 4.02391 11.4945 3.96215 11.6904C3.96156 11.6925 3.95979 11.7014 3.95649 11.7178C3.95278 11.7362 3.94785 11.7602 3.94422 11.79C3.93686 11.8507 3.9329 11.9232 3.9329 12C3.9329 12.0768 3.93686 12.1493 3.94422 12.21C3.94785 12.2398 3.95278 12.2638 3.95649 12.2822C3.95978 12.2986 3.96155 12.3075 3.96215 12.3096C4.0239 12.5054 4.07572 12.5813 4.55014 13.0693C6.24225 14.81 8.99948 17 12.0005 17C15.0013 16.9999 17.7568 14.8099 19.4489 13.0693C19.9235 12.5812 19.9762 12.5052 20.0378 12.3096C20.0385 12.3075 20.0402 12.2985 20.0435 12.2822C20.0472 12.2638 20.0512 12.2397 20.0548 12.21C20.0622 12.1493 20.0671 12.0768 20.0671 12C20.0671 11.9232 20.0622 11.8507 20.0548 11.79C20.0512 11.7603 20.0472 11.7362 20.0435 11.7178C20.0402 11.7014 20.0384 11.6925 20.0378 11.6904C19.9762 11.4948 19.9234 11.4188 19.4489 10.9307C17.7568 9.19005 15.0013 7.00014 12.0005 7ZM12.9669 12C12.9669 11.4479 12.534 11.0003 12.0005 11C11.4667 11 11.034 11.4477 11.034 12C11.034 12.5523 11.4667 13 12.0005 13C12.534 12.9997 12.9669 12.5521 12.9669 12ZM14.8998 12C14.8998 13.6567 13.6015 14.9997 12.0005 15C10.3992 15 9.10113 13.6569 9.10113 12C9.10113 10.3431 10.3992 9 12.0005 9C13.6015 9.00026 14.8998 10.3433 14.8998 12Z" fill="currentColor"/>
    </svg>
  )
}
function SparkleIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
      <path d="M5 0.5L5.9 3.8L9 5L5.9 6.2L5 9.5L4.1 6.2L1 5L4.1 3.8L5 0.5Z" fill="currentColor" />
    </svg>
  )
}
function SignalWaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7c0 0 1.5-4 3-4s2 8 3.5 8S10 3 11.5 3 13 7 13 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M2 17.7996V8.19996C2 7.6564 1.99893 7.18821 2.03028 6.80445C2.06258 6.40918 2.13437 6.01581 2.32715 5.63746C2.61475 5.0731 3.07334 4.61451 3.6377 4.32691C4.01605 4.13413 4.40942 4.06234 4.80469 4.03004C5.18845 3.99869 5.65664 3.99977 6.2002 3.99977H9C9.55229 3.99977 10 4.44748 10 4.99977C10 5.55205 9.55229 5.99977 9 5.99977H6.2002C5.62366 5.99977 5.25124 6.00103 4.96778 6.02418C4.69598 6.04638 4.59528 6.08398 4.5459 6.10914C4.35779 6.205 4.20524 6.35755 4.10938 6.54566C4.08422 6.59505 4.04662 6.69574 4.02442 6.96754C4.00127 7.251 4 7.62342 4 8.19996V17.7996C4 18.3761 4.00127 18.7487 4.02442 19.032C4.04661 19.3035 4.08417 19.4044 4.10938 19.4539C4.20555 19.6424 4.35841 19.7958 4.5459 19.8914C4.59521 19.9164 4.69595 19.9542 4.9668 19.9763C5.24974 19.9994 5.62182 19.9998 6.19727 19.9998H15.8027C16.3779 19.9998 16.7496 19.9994 17.0322 19.9763C17.3025 19.9542 17.4037 19.9165 17.4531 19.8914C17.6415 19.7954 17.7958 19.6408 17.8916 19.4529C17.9167 19.4034 17.9545 19.3028 17.9766 19.033C17.9997 18.7502 18 18.378 18 17.8025V14.9998C18 14.4475 18.4477 13.9998 19 13.9998C19.5523 13.9998 20 14.4475 20 14.9998V17.8025C20 18.3447 20.001 18.812 19.9697 19.1951C19.9374 19.5899 19.8655 19.983 19.6729 20.3611C19.3851 20.9258 18.9256 21.3851 18.3613 21.6726C17.9833 21.8653 17.5902 21.9372 17.1953 21.9695C16.8123 22.0008 16.345 21.9998 15.8027 21.9998H6.19727C5.6548 21.9998 5.187 22.0008 4.80372 21.9695C4.40889 21.9372 4.01581 21.8653 3.6377 21.6726C3.0729 21.3848 2.61446 20.9257 2.32715 20.3621C2.13441 19.9838 2.06259 19.5903 2.03028 19.1951C1.99893 18.8115 2 18.3431 2 17.7996ZM17.3691 2.22437C17.7619 1.90402 18.3409 1.92662 18.707 2.29273L21.707 5.29273C22.0976 5.68326 22.0976 6.31627 21.707 6.7068L12.707 15.7068C12.5195 15.8943 12.2652 15.9998 12 15.9998H9C8.44772 15.9998 8 15.5521 8 14.9998V11.9998C8 11.7345 8.10544 11.4803 8.29297 11.2927L17.293 2.29273L17.3691 2.22437ZM10 12.4138V13.9998H11.5859L16.5859 8.99977L15 7.41383L10 12.4138ZM16.4141 5.99977L18 7.5857L19.5859 5.99977L18 4.41383L16.4141 5.99977Z" fill="currentColor"/>
    </svg>
  )
}
function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 4V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M14.2222 2C15.6732 2 16.9045 2.92813 17.3624 4.22222H18.6667C20.4501 4.22222 21.9064 5.62284 21.9957 7.38411L22 7.55556V8.44423C22 9.58965 21.2112 10.5478 20.1478 10.8129L19.4023 19.0725L19.4013 19.0714C19.2813 20.4502 18.2129 21.9054 16.4857 21.9957L16.3153 22H7.68359C5.86414 21.9988 4.72947 20.5049 4.59983 19.0844L4.59874 19.0855L3.80339 10.7999C2.76487 10.5178 2 9.57199 2 8.44423V7.55556C2.00001 5.71462 3.49238 4.22222 5.33333 4.22222H6.63759C7.09549 2.92813 8.32683 2 9.77778 2H14.2222ZM9.77778 4.22222C9.16413 4.22222 8.66667 4.71968 8.66667 5.33333V6.44444H5.33333C4.71969 6.44444 4.22222 6.94191 4.22222 7.55556V8.44423C4.22222 8.56696 4.32193 8.66667 4.44466 8.66667H5.8303L6.8112 18.8728C6.85194 19.385 7.23096 19.7775 7.68468 19.7778H16.3153C16.7692 19.7777 17.148 19.3851 17.1888 18.8728L18.1111 8.66667H19.5553C19.6781 8.66667 19.7778 8.56696 19.7778 8.44423V7.55556C19.7778 6.94191 19.2803 6.44444 18.6667 6.44444H15.3333V5.33333C15.3333 4.71968 14.8359 4.22222 14.2222 4.22222H9.77778ZM9.77778 9.77778C10.3914 9.77778 10.8889 10.2752 10.8889 10.8889V16.4444C10.8889 17.0581 10.3914 17.5556 9.77778 17.5556C9.16413 17.5556 8.66667 17.0581 8.66667 16.4444V10.8889C8.66667 10.2752 9.16413 9.77778 9.77778 9.77778ZM14.2222 9.77778C14.8359 9.77778 15.3333 10.2752 15.3333 10.8889V16.4444C15.3333 17.0581 14.8359 17.5556 14.2222 17.5556C13.6086 17.5556 13.1111 17.0581 13.1111 16.4444V10.8889C13.1111 10.2752 13.6086 9.77778 14.2222 9.77778Z" fill="currentColor"/>
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="3" y="2.5" width="2.5" height="8" rx="1" fill="currentColor" />
      <rect x="7.5" y="2.5" width="2.5" height="8" rx="1" fill="currentColor" />
    </svg>
  )
}
function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M3.5 2.5l7 4-7 4v-8z" fill="currentColor" />
    </svg>
  )
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  active:    { label: 'Active',    color: 'green'  },
  triggered: { label: 'Triggered', color: 'coral'  },
  paused:    { label: 'Paused',    color: 'horizon' },
  error:     { label: 'Error',     color: 'cobalt'  },
}

const STATUS_FILTERS = [
  { value: 'all',       label: 'All'       },
  { value: 'active',    label: 'Active'    },
  { value: 'triggered', label: 'Triggered' },
  { value: 'paused',    label: 'Paused'    },
  { value: 'error',     label: 'Error'     },
]

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_SIGNALS = [
  { id: '1f0254bf-00000000b4c5', name: 'Agent Introduction Engine',         context: 'Evaluates the communication style of an enterprise customer on a call in a commercial relationship', createdAt: '12/01/2025 11:36:26', autoProcess: true,  executions: 14, status: 'active',    source: 'ai'     },
  { id: '2a3b4c5d-00000000c6d7', name: 'Billing Dispute Classifier',        context: 'Detects billing-related complaints and routes them to the correct escalation path automatically',     createdAt: '12/02/2025 09:14:52', autoProcess: true,  executions: 31, status: 'triggered', source: 'ai'     },
  { id: '3c4d5e6f-00000000d8e9', name: 'Active Data Source Engine',         context: 'Monitors active data pipeline connections and alerts on unexpected latency or dropout events',         createdAt: '12/03/2025 14:07:33', autoProcess: false, executions: 8,  status: 'paused',    source: 'system' },
  { id: '4d5e6f70-00000000e9f0', name: 'Junk Filter Separator',             context: 'Isolates and quarantines non-productive call segments for downstream analytics cleansing',            createdAt: '12/04/2025 10:55:18', autoProcess: true,  executions: 22, status: 'active',    source: null     },
  { id: '5e6f7081-00000000f0a1', name: 'Escalation Spike Detector',         context: 'Surfaces abnormal escalation frequency within a 24-hour window against 30-day rolling baseline',     createdAt: '12/05/2025 08:22:44', autoProcess: true,  executions: 7,  status: 'triggered', source: 'ai'     },
  { id: '6f708192-000000000b1c', name: 'CSAT Drop Alert',                   context: 'Triggers when average CSAT score drops more than 8 percentage points in any rolling 7-day window',    createdAt: '12/06/2025 16:43:09', autoProcess: true,  executions: 5,  status: 'active',    source: 'system' },
  { id: '70819203-000000001c2d', name: 'Churn Risk Signal',                 context: 'Identifies high-value customers exhibiting churn-predictive language across recent call history',     createdAt: '12/07/2025 11:18:57', autoProcess: false, executions: 19, status: 'paused',    source: 'ai'     },
  { id: '819203a4-000000002d3e', name: 'Compliance Keyword Monitor',        context: 'Flags calls containing regulated terms that require mandatory disclosure or review under policy',      createdAt: '12/08/2025 13:36:21', autoProcess: true,  executions: 44, status: 'active',    source: 'system' },
  { id: '9203a4b5-000000003e4f', name: 'Peak Hour Staffing Signal',         context: 'Predicts understaffing risk 90 minutes in advance based on inbound volume trend and AHT patterns',  createdAt: '12/09/2025 07:51:30', autoProcess: true,  executions: 26, status: 'active',    source: null     },
  { id: 'a3b4c5d6-000000004f50', name: 'Agent Silence Pattern Detector',    context: 'Detects unusually long silence periods correlated with agent disengagement or knowledge gaps',       createdAt: '12/10/2025 15:09:44', autoProcess: false, executions: 11, status: 'error',     source: 'ai'     },
  { id: 'b4c5d6e7-000000005061', name: 'New Product Mention Tracker',       context: 'Captures unsolicited product mentions by customers to surface organic demand and feedback signals',   createdAt: '12/11/2025 09:27:16', autoProcess: true,  executions: 38, status: 'active',    source: 'system' },
  { id: 'c5d6e7f8-000000006172', name: 'Repeat Caller Identifier',          context: 'Surfaces customers who have contacted support more than three times in a 14-day rolling window',      createdAt: '12/12/2025 12:44:08', autoProcess: true,  executions: 17, status: 'triggered', source: null     },
  { id: 'd6e7f809-000000007283', name: 'Resolution Rate Anomaly',           context: 'Alerts when same-day resolution rate falls below the agreed SLA threshold for any queue',            createdAt: '12/13/2025 10:33:55', autoProcess: true,  executions: 9,  status: 'active',    source: 'ai'     },
  { id: 'e7f8091a-000000008394', name: 'Sentiment Reversal Signal',         context: 'Detects mid-call sentiment reversals (positive→negative) that correlate with agent script deviations', createdAt: '12/14/2025 14:22:39', autoProcess: false, executions: 6,  status: 'paused',    source: 'system' },
  { id: 'f809102b-0000000094a5', name: 'Upsell Opportunity Detector',       context: 'Surfaces calls where customer intent signals indicate openness to upgrade or add-on product offers',  createdAt: '12/15/2025 08:47:22', autoProcess: true,  executions: 51, status: 'active',    source: null     },
]

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  const [on, setOn] = useState(value)

  function toggle(e) {
    e.stopPropagation()
    const next = !on
    setOn(next)
    onChange?.(next)
  }

  return (
    <button
      onClick={toggle}
      title={on ? 'Auto Process: ON' : 'Auto Process: OFF'}
      style={{
        position: 'relative',
        width: 42, height: 24, borderRadius: 12,
        background: on ? 'var(--b100)' : 'var(--border-default)',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        outline: 'none',
        padding: 0,
        transition: 'background 220ms ease',
        boxShadow: on ? '0 0 0 3px rgba(23,121,247,0.15)' : 'none',
      }}
    >
      <span style={{
        position: 'absolute',
        top: 3, left: on ? 21 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        transition: 'left 200ms cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </button>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status]
  if (!cfg) return null
  return <Badge variant="tinted" color={cfg.color}>{cfg.label}</Badge>
}

// ── Status filter tabs ────────────────────────────────────────────────────────
function StatusTabs({ active, onChange, counts }) {
  return (
    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
      {STATUS_FILTERS.map(f => {
        const isActive = active === f.value
        const count = counts[f.value]
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              height: 28, padding: '0 10px', borderRadius: 6,
              background: isActive ? 'var(--bg-active)' : 'transparent',
              border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: 12, fontWeight: isActive ? 600 : 400,
              fontFamily: "'Byrd', sans-serif",
              cursor: 'pointer',
              transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-active)' } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' } }}
          >
            {f.label}
            {count != null && count > 0 && (
              <span style={{
                minWidth: 16, height: 16, padding: '0 4px', borderRadius: 99,
                background: isActive ? 'var(--border-default)' : 'var(--bg-active)',
                fontSize: 10, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: isActive ? 'var(--text-secondary)' : 'var(--text-muted)',
              }}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Row action menu ───────────────────────────────────────────────────────────
function MenuRow({ icon, label, onClick, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 9,
        width: '100%', padding: '7px 12px',
        background: hov ? 'var(--bg-active)' : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        color: danger ? '#DC2626' : 'var(--text-secondary)',
        fontSize: 12, fontFamily: "'Byrd', sans-serif", fontWeight: 500,
        transition: 'background 100ms ease',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function RowMenu({ onEdit, onDuplicate, onTogglePause, isPaused, onDelete }) {
  const [anchor, setAnchor] = useState(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!anchor) return
    function onDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setAnchor(null)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [anchor])

  function openMenu(e) {
    e.stopPropagation()
    if (anchor) { setAnchor(null); return }
    const r = btnRef.current.getBoundingClientRect()
    setAnchor({ top: r.bottom + 4, right: window.innerWidth - r.right })
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        onClick={openMenu}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26, borderRadius: 5,
          background: anchor ? 'var(--bg-active)' : 'transparent',
          border: '1px solid ' + (anchor ? 'var(--border-default)' : 'transparent'),
          cursor: 'pointer', color: 'var(--text-secondary)',
          transition: 'background 120ms ease, border-color 120ms ease',
        }}
        onMouseEnter={e => { if (!anchor) { e.currentTarget.style.background = 'var(--bg-active)'; e.currentTarget.style.borderColor = 'var(--border-input)' } }}
        onMouseLeave={e => { if (!anchor) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' } }}
      >
        <MoreIcon />
      </button>

      {anchor && createPortal(
        <div ref={menuRef} style={{
          position: 'fixed',
          top: anchor.top, right: anchor.right,
          background: 'var(--bg-card)', border: '1px solid var(--border-default)',
          borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
          zIndex: 9999, minWidth: 180, padding: '4px 0',
        }}
        >
          <MenuRow icon={<RunRevisionIcon />} label="Run Revision"          onClick={() => setAnchor(null)} />
          <MenuRow icon={<ExportIcon />}      label="Export"                 onClick={() => setAnchor(null)} />
          <MenuRow icon={<CopyIcon />}        label="Export Configuration"   onClick={() => setAnchor(null)} />
          <MenuRow icon={<CloneIcon />}       label="Clone"                  onClick={() => setAnchor(null)} />
          <MenuRow icon={<EditIcon />}        label="Edit"                   onClick={() => { onEdit?.(); setAnchor(null) }} />
          <MenuRow icon={<TalkIcon />}        label="Talk"                   onClick={() => setAnchor(null)} />
          <MenuRow icon={<HistoryIcon />}     label="History"                onClick={() => setAnchor(null)} />
          <MenuRow icon={<ViewIcon />}        label="View"                   onClick={() => setAnchor(null)} />
          <div style={{ height: 1, background: 'var(--border-input)', margin: '4px 0' }} />
          <MenuRow icon={<TrashIcon />}       label="Delete"                 onClick={() => { onDelete?.(); setAnchor(null) }} danger />
        </div>,
        document.body
      )}
    </div>
  )
}

// ── AG Grid cell renderers ────────────────────────────────────────────────────
function ToggleCellRenderer({ value, data, context }) {
  return (
    <Toggle
      value={value}
      onChange={next => context?.onToggleAutoProcess?.(data.id, next)}
    />
  )
}

function SourceTagCellRenderer({ value }) {
  if (value === 'ai') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 20, padding: '0 8px', borderRadius: 999,
      background: 'rgba(255,112,86,0.12)', border: '1px solid rgba(255,112,86,0.28)',
      color: 'var(--c100)', fontSize: 11, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap',
    }}>
      <SparkleIcon /> AI Generated
    </span>
  )
  if (value === 'system') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 20, padding: '0 8px', borderRadius: 999,
      background: 'rgba(23,121,247,0.10)', border: '1px solid rgba(23,121,247,0.25)',
      color: 'var(--b100)', fontSize: 11, fontWeight: 600,
      fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap',
    }}>
      <ShieldIcon /> System
    </span>
  )
  return null
}

function StatusCellRenderer({ value }) {
  return <StatusBadge status={value} />
}

function ExecutionsCellRenderer({ value }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <RunRevisionIcon />
      </span>
      <span style={{ fontSize: 13, fontFamily: "'Byrd', sans-serif", fontWeight: 500, color: 'var(--text-primary)' }}>
        {value}
      </span>
    </span>
  )
}

function ActionsCellRenderer({ data, context }) {
  return (
    <RowMenu
      isPaused={data.status === 'paused'}
      onTogglePause={() => context?.onTogglePause?.(data.id)}
      onDelete={() => context?.onDelete?.(data.id)}
    />
  )
}

function IdCellRenderer({ value }) {
  return (
    <span
      onClick={e => e.stopPropagation()}
      style={{
        fontFamily: "'Byrd', sans-serif", fontSize: 12,
        color: 'var(--b100)', fontWeight: 500,
        letterSpacing: '0.01em',
        textDecoration: 'underline',
        textDecorationColor: 'rgba(23,121,247,0.35)',
        textUnderlineOffset: 3,
        cursor: 'pointer',
      }}
    >
      {value}
    </span>
  )
}

// ── Column definitions ────────────────────────────────────────────────────────
const DEFAULT_COL_DEF = {
  sortable: true,
  resizable: true,
  suppressMovable: false,
  cellStyle: { display: 'flex', alignItems: 'center' },
}

// ── SignalsPage ───────────────────────────────────────────────────────────────
export default function SignalsPage({ isMobile, sidebarWidth = 272, sidebarTransition }) {
  const gridRef   = useRef(null)
  const [signals, setSignals] = useState(MOCK_SIGNALS)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [isDark, setIsDark] = useState(() => document.documentElement.dataset.theme === 'dark')
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.dataset.theme === 'dark')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  const left = isMobile ? 0 : sidebarWidth

  // ── Callbacks ────────────────────────────────────────────────────────────────
  const onToggleAutoProcess = useCallback((id, next) => {
    setSignals(prev => prev.map(s => s.id === id ? { ...s, autoProcess: next } : s))
  }, [])

  const onTogglePause = useCallback((id) => {
    setSignals(prev => prev.map(s => {
      if (s.id !== id) return s
      return { ...s, status: s.status === 'paused' ? 'active' : 'paused' }
    }))
  }, [])

  const onDelete = useCallback((id) => {
    setSignals(prev => prev.filter(s => s.id !== id))
  }, [])

  const gridContext = { onToggleAutoProcess, onTogglePause, onDelete }

  // ── Filtering ─────────────────────────────────────────────────────────────────
  const filtered = signals.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (searchText) {
      const q = searchText.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.context.toLowerCase().includes(q) || s.id.includes(q)
    }
    return true
  })

  const counts = {
    all:       signals.length,
    active:    signals.filter(s => s.status === 'active').length,
    triggered: signals.filter(s => s.status === 'triggered').length,
    paused:    signals.filter(s => s.status === 'paused').length,
    error:     signals.filter(s => s.status === 'error').length,
  }

  // ── Column defs (stable ref) ──────────────────────────────────────────────────
  const colDefs = [
    {
      headerName: '#',
      valueGetter: 'node.rowIndex + 1',
      width: 52,
      sortable: false,
      resizable: false,
      cellStyle: { display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: 12 },
    },
    {
      headerName: 'Auto Process',
      field: 'autoProcess',
      width: 120,
      sortable: false,
      cellRenderer: ToggleCellRenderer,
      cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
      headerName: 'ID',
      field: 'id',
      width: 178,
      cellRenderer: IdCellRenderer,
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 1,
      minWidth: 180,
    },
    {
      headerName: 'Type',
      field: 'source',
      width: 148,
      sortable: false,
      cellRenderer: SourceTagCellRenderer,
      cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
      headerName: 'Context',
      field: 'context',
      flex: 2,
      minWidth: 220,
      cellStyle: { display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' },
    },
    {
      headerName: 'Created At',
      field: 'createdAt',
      width: 158,
      cellStyle: { display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: 12 },
    },
    {
      headerName: 'Executions',
      field: 'executions',
      width: 110,
      cellRenderer: ExecutionsCellRenderer,
      cellStyle: { display: 'flex', alignItems: 'center' },
    },
    {
      headerName: '',
      field: 'actions',
      width: 52,
      sortable: false,
      resizable: false,
      cellRenderer: ActionsCellRenderer,
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    },
  ]

  return (
    <div
      data-inspector="SignalsPage"
      style={{
        position: 'fixed', top: 0, left, right: 0, bottom: 0,
        background: 'var(--bg-canvas)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transition: sidebarTransition,
      }}
    >
      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px', height: 52, flexShrink: 0,
        margin: '16px 16px 0',
        background: 'var(--bg-sidebar)',
        border: '1px solid var(--border-default)',
        borderRadius: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      }}>
        {/* Left: title + count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 'var(--type-p11)', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Byrd', sans-serif" }}>
            Signals
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif" }}>›</span>
          <Badge variant="tinted" color="teal" shape="pill">
            Total signals&nbsp;{signals.length}
          </Badge>
          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--type-p14)', fontFamily: "'Byrd', sans-serif" }}>›</span>
          {/* Quota indicator */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 22, padding: '0 8px', borderRadius: 999,
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.28)',
            flexShrink: 0,
          }}>
            <span style={{
              width: 28, height: 3, borderRadius: 99,
              background: 'rgba(220,38,38,0.25)', overflow: 'hidden', flexShrink: 0,
            }}>
              <span style={{
                display: 'block', height: '100%', width: '90%',
                background: '#DC2626', borderRadius: 99,
              }} />
            </span>
            <span style={{
              fontSize: 11, fontWeight: 600, color: '#DC2626',
              fontFamily: "'Byrd', sans-serif", whiteSpace: 'nowrap',
            }}>
              9 / 10
            </span>
          </span>
        </div>

        {/* Right: create */}
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon />}
            onClick={() => navigate('/signals/create')}
          >
            Create
          </Button>
        </div>
      </div>

      {/* ── AG Grid ───────────────────────────────────────────────────────── */}
      <div
        data-inspector="SignalsGrid"
        style={{
          flex: 1, overflow: 'hidden', padding: 0,
          border: '1px solid var(--border-default)',
          borderRadius: 16,
          margin: '16px 16px 16px',
        }}
      >
        <AgGridReact
          ref={gridRef}
          theme={isDark ? darkTheme : lightTheme}
          className="hear-grid"
          rowData={filtered}
          columnDefs={colDefs}
          defaultColDef={DEFAULT_COL_DEF}
          rowHeight={44}
          headerHeight={38}
          suppressCellFocus={false}
          animateRows={true}
          context={gridContext}
          getRowId={p => p.data.id}
        />
      </div>
    </div>
  )
}

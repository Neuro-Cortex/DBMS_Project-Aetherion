// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, DollarSign, Activity, Clock, Heart, Building2, Plus, ArrowRight, Star,
  TrendingUp, TrendingDown, Truck, Pill, MessageCircle, Stethoscope, Bed, AlertCircle,
  CheckCircle2, XCircle, RefreshCw, Zap, Brain, Shield, Phone, Video, MapPin, ChevronRight,
  BarChart3, PieChart, LineChart, Wallet, Target, Award, Globe, UserPlus, BellRing,
  Thermometer, Microscope, Syringe, Laptop, Bell, Settings, Search, Filter, Download,
  MoreHorizontal, Navigation, Wifi, Clipboard, FileText, ImageIcon, Send, Share2,
  Bookmark, ThumbsUp, ThumbsDown, Smile, Frown, Meh, Flame, Crown, Gem, Bolt,
  Sparkles, Rocket, Ghost, Bone, Eye, Ear, Baby, Footprints, Accessibility, Monitor,
  Tablet, Smartphone, Camera, Music, ShoppingCart, Package, Gift, Coffee, Utensils,
  Home, Key, Lock, Unlock, EyeOff, Volume2, VolumeX, Mic, MicOff, Radio, Tv, Cast,
  Airplay, Link, Unlink, ExternalLink, Copy, ClipboardCopy, ClipboardPaste, Trash2,
  Edit3, PlusCircle, MinusCircle, HelpCircle, Info, AlertTriangle, Flag, Hash, AtSign,
  Percent, Divide, Equal, Infinity, Sigma, Pi, Sun, Moon, Cloud, CloudRain,
  CloudSnow, CloudLightning, Wind, Waves, FlameIcon, Trees, Mountain, Building,
  Factory, Hotel, Warehouse, Store, ShoppingBag, CreditCard, Banknote, Coins,
  Receipt, ScrollText, PenTool, Pencil, Ruler, Scissors, Eraser, PaintBucket,
  Palette, Layers, Grid3X3, Layout, LayoutDashboard, LayoutGrid, LayoutList,
  LayoutTemplate, Columns, Rows, Split, PanelTop, PanelBottom, PanelLeft, PanelRight
} from 'lucide-react';
import { StatCard } from 'src/components/DashBoard/statCard';

import { ActivityChart } from 'src/components/DashBoard/Activitychart';


import { RecentAppointments } from 'src/components/DashBoard/RecentAppointments';

// ============================================
// COMPLETE TYPE DEFINITIONS
// ============================================
interface DoctorStats { id: string; name: string; specialty: string; patients: number; rating: number; availability: 'available' | 'busy' | 'offline'; experience: number; languages: string[]; education: string; successRate: number; reviews: number; nextAvailable?: string; consultationFee: number; isVerified: boolean; }
interface ResourceStatus { id: string; name: string; total: number; used: number; available: number; icon: React.ElementType; color: string; trend: 'up' | 'down'; change: string; }
interface QuickStat { label: string; value: string; change: string; trend: 'up' | 'down'; icon: React.ElementType; }
interface RecentActivity { id: string; type: 'appointment'|'admission'|'discharge'|'emergency'|'lab'|'surgery'|'prescription'|'telemedicine'|'billing'|'complaint'|'transfer'|'followup'; title: string; description: string; time: string; patient: string; doctor?: string; status: 'completed'|'pending'|'in-progress'|'cancelled'|'critical'; priority: 'high'|'medium'|'low'; }
interface DepartmentStat { id: string; name: string; patients: number; staff: number; occupancy: number; icon: React.ElementType; color: string; beds: number; surgeries: number; satisfaction: number; revenue: string; }
interface FinancialData { month: string; revenue: number; expenses: number; profit: number; }
interface PatientDemographic { ageGroup: string; percentage: number; color: string; }
interface Notification { id: string; title: string; description: string; time: string; type: 'alert'|'info'|'success'|'warning'; read: boolean; }
interface Task { id: string; title: string; dueDate: string; priority: 'high'|'medium'|'low'; status: 'pending'|'completed'; assignedTo: string; }
interface UpcomingEvent { id: string; title: string; date: string; time: string; type: 'meeting'|'conference'|'training'|'surgery'|'appointment'; attendees: number; }
interface PatientReview { id: string; patientName: string; rating: number; comment: string; date: string; doctorName: string; sentiment: 'positive'|'neutral'|'negative'; }
interface InsuranceClaim { id: string; patientName: string; amount: string; status: 'approved'|'pending'|'denied'; date: string; insuranceProvider: string; }
interface InventoryItem { id: string; name: string; category: string; stock: number; threshold: number; status: 'in-stock'|'low'|'out-of-stock'; lastOrdered: string; }
interface StaffMember { id: string; name: string; role: string; department: string; status: 'on-duty'|'off-duty'|'on-leave'; shift: string; }
interface HospitalMetrics { id: string; label: string; value: string; icon: React.ElementType; color: string; }
interface RevenueByService { service: string; amount: number; percentage: number; color: string; }
interface PatientFlow { hour: string; admissions: number; discharges: number; }
interface BedOccupancyTrend { date: string; general: number; icu: number; emergency: number; }
interface RegionPerformance { region: string; patients: number; revenue: string; satisfaction: number; }
interface ComplianceMetric { id: string; name: string; status: 'compliant'|'warning'|'non-compliant'; score: number; lastAudit: string; }

// ============================================
// EXTENSIVE MOCK DATA
// ============================================
const topDoctors: DoctorStats[] = [
  { id:'1',name:'Dr. Sarah Wilson',specialty:'Cardiology',patients:125,rating:4.9,availability:'available',experience:15,languages:['English','Spanish'],education:'Harvard Medical School',successRate:98,reviews:234,nextAvailable:'Today 2:00 PM',consultationFee:250,isVerified:true },
  { id:'2',name:'Dr. James Lee',specialty:'Neurology',patients:98,rating:4.8,availability:'busy',experience:12,languages:['English','Korean'],education:'Stanford University',successRate:96,reviews:189,nextAvailable:'Tomorrow 9:00 AM',consultationFee:300,isVerified:true },
  { id:'3',name:'Dr. Emily Chen',specialty:'Pediatrics',patients:156,rating:4.7,availability:'available',experience:10,languages:['English','Mandarin'],education:'Johns Hopkins',successRate:97,reviews:312,nextAvailable:'Today 4:30 PM',consultationFee:200,isVerified:true },
  { id:'4',name:'Dr. Michael Park',specialty:'Orthopedics',patients:112,rating:4.6,availability:'offline',experience:18,languages:['English'],education:'Yale University',successRate:95,reviews:178,nextAvailable:'Mon 10:00 AM',consultationFee:275,isVerified:true },
  { id:'5',name:'Dr. Lisa Anderson',specialty:'Dermatology',patients:89,rating:4.9,availability:'available',experience:8,languages:['English','French'],education:'UCLA',successRate:99,reviews:156,nextAvailable:'Today 1:00 PM',consultationFee:225,isVerified:true },
  { id:'6',name:'Dr. Robert Kim',specialty:'Oncology',patients:134,rating:4.8,availability:'busy',experience:20,languages:['English','Korean'],education:'MIT',successRate:94,reviews:289,nextAvailable:'Wed 11:00 AM',consultationFee:350,isVerified:true },
  { id:'7',name:'Dr. Maria Garcia',specialty:'Gynecology',patients:145,rating:4.7,availability:'available',experience:14,languages:['English','Spanish'],education:'Columbia',successRate:97,reviews:267,nextAvailable:'Today 5:00 PM',consultationFee:240,isVerified:true },
  { id:'8',name:'Dr. David Thompson',specialty:'Psychiatry',patients:78,rating:4.9,availability:'available',experience:16,languages:['English'],education:'Oxford',successRate:96,reviews:145,nextAvailable:'Tomorrow 2:00 PM',consultationFee:280,isVerified:true },
];

const resources: ResourceStatus[] = [
  { id:'1',name:'General Beds',total:300,used:245,available:55,icon:Bed,color:'blue',trend:'down',change:'-3%' },
  { id:'2',name:'ICU Beds',total:50,used:42,available:8,icon:Activity,color:'red',trend:'up',change:'+5%' },
  { id:'3',name:'Ventilators',total:40,used:28,available:12,icon:Thermometer,color:'amber',trend:'down',change:'-2%' },
  { id:'4',name:'Operating Rooms',total:12,used:8,available:4,icon:Syringe,color:'purple',trend:'up',change:'+10%' },
  { id:'5',name:'Emergency Bays',total:15,used:9,available:6,icon:AlertCircle,color:'orange',trend:'down',change:'-5%' },
  { id:'6',name:'Dialysis Machines',total:20,used:14,available:6,icon:Activity,color:'cyan',trend:'up',change:'+8%' },
  { id:'7',name:'MRI Scanners',total:5,used:3,available:2,icon:Zap,color:'indigo',trend:'down',change:'-1%' },
  { id:'8',name:'CT Scanners',total:6,used:4,available:2,icon:Zap,color:'pink',trend:'up',change:'+2%' },
];

const quickStats: QuickStat[] = [
  { label:'New Patients Today',value:'48',change:'+12%',trend:'up',icon:UserPlus },
  { label:'Discharged Today',value:'32',change:'-5%',trend:'down',icon:CheckCircle2 },
  { label:'Surgeries Scheduled',value:'8',change:'+15%',trend:'up',icon:Syringe },
  { label:'Lab Results Pending',value:'23',change:'-8%',trend:'down',icon:Microscope },
  { label:'Telemedicine Calls',value:'156',change:'+22%',trend:'up',icon:Video },
  { label:'Prescriptions Filled',value:'342',change:'+18%',trend:'up',icon:Pill },
  { label:'Emergency Visits',value:'67',change:'-3%',trend:'down',icon:AlertCircle },
  { label:'Patient Satisfaction',value:'4.8',change:'+0.2',trend:'up',icon:ThumbsUp },
];

const recentActivities: RecentActivity[] = [
  { id:'1',type:'emergency',title:'Code Blue - ICU Room 302',description:'Cardiac arrest patient requiring immediate resuscitation',time:'2 min ago',patient:'Robert Wilson',doctor:'Dr. Sarah Wilson',status:'critical',priority:'high' },
  { id:'2',type:'appointment',title:'New Appointment Booked',description:'Cardiology consultation for chest pain evaluation',time:'5 min ago',patient:'Sarah Johnson',doctor:'Dr. James Lee',status:'pending',priority:'medium' },
  { id:'3',type:'admission',title:'Patient Admitted',description:'Admitted to general ward for observation',time:'10 min ago',patient:'John Doe',doctor:'Dr. Emily Chen',status:'completed',priority:'medium' },
  { id:'4',type:'lab',title:'Lab Results Ready',description:'Blood work and lipid profile complete',time:'15 min ago',patient:'Maria Garcia',status:'completed',priority:'low' },
  { id:'5',type:'surgery',title:'Surgery Completed',description:'Appendectomy successful, patient in recovery',time:'25 min ago',patient:'David Kim',doctor:'Dr. Michael Park',status:'completed',priority:'medium' },
  { id:'6',type:'prescription',title:'Prescription Refilled',description:'Lisinopril 10mg - 30 day supply',time:'30 min ago',patient:'Lisa Thompson',status:'completed',priority:'low' },
  { id:'7',type:'telemedicine',title:'Virtual Consult Started',description:'Video consultation with neurologist',time:'45 min ago',patient:'James Wilson',doctor:'Dr. Robert Kim',status:'in-progress',priority:'medium' },
  { id:'8',type:'discharge',title:'Patient Discharged',description:'Discharged after successful treatment',time:'1 hour ago',patient:'Emily Davis',status:'completed',priority:'low' },
  { id:'9',type:'followup',title:'Follow-up Scheduled',description:'Post-surgery follow-up appointment',time:'2 hours ago',patient:'Michael Brown',doctor:'Dr. Lisa Anderson',status:'pending',priority:'low' },
  { id:'10',type:'billing',title:'Invoice Generated',description:'Invoice #INV-2024-0892 for cardiac procedure',time:'3 hours ago',patient:'Sarah Johnson',status:'completed',priority:'low' },
  { id:'11',type:'transfer',title:'Patient Transferred',description:'Transferred from ICU to General Ward',time:'4 hours ago',patient:'Robert Wilson',status:'completed',priority:'medium' },
  { id:'12',type:'complaint',title:'Complaint Filed',description:'Patient complained about wait time',time:'5 hours ago',patient:'Jane Smith',status:'pending',priority:'high' },
];

const departmentStats: DepartmentStat[] = [
  { id:'1',name:'Cardiology',patients:245,staff:35,occupancy:85,icon:Heart,color:'from-red-500 to-pink-500',beds:80,surgeries:45,satisfaction:4.8,revenue:'$125K' },
  { id:'2',name:'Neurology',patients:180,staff:28,occupancy:72,icon:Brain,color:'from-purple-500 to-indigo-500',beds:60,surgeries:30,satisfaction:4.7,revenue:'$98K' },
  { id:'3',name:'Pediatrics',patients:156,staff:22,occupancy:60,icon:Baby,color:'from-green-500 to-emerald-500',beds:45,surgeries:15,satisfaction:4.9,revenue:'$82K' },
  { id:'4',name:'Orthopedics',patients:198,staff:30,occupancy:78,icon:Bone,color:'from-amber-500 to-orange-500',beds:55,surgeries:52,satisfaction:4.6,revenue:'$145K' },
  { id:'5',name:'Oncology',patients:134,staff:25,occupancy:68,icon:Shield,color:'from-blue-500 to-cyan-500',beds:40,surgeries:22,satisfaction:4.8,revenue:'$210K' },
  { id:'6',name:'Emergency',patients:320,staff:45,occupancy:92,icon:AlertCircle,color:'from-red-500 to-rose-500',beds:25,surgeries:0,satisfaction:4.5,revenue:'$180K' },
  { id:'7',name:'Radiology',patients:210,staff:20,occupancy:55,icon:Zap,color:'from-indigo-500 to-violet-500',beds:0,surgeries:0,satisfaction:4.6,revenue:'$95K' },
  { id:'8',name:'Pharmacy',patients:500,staff:15,occupancy:40,icon:Pill,color:'from-teal-500 to-green-500',beds:0,surgeries:0,satisfaction:4.7,revenue:'$320K' },
];

const financialData: FinancialData[] = [
  { month:'Jan',revenue:280000,expenses:210000,profit:70000 },
  { month:'Feb',revenue:320000,expenses:230000,profit:90000 },
  { month:'Mar',revenue:350000,expenses:250000,profit:100000 },
  { month:'Apr',revenue:380000,expenses:270000,profit:110000 },
  { month:'May',revenue:420000,expenses:300000,profit:120000 },
  { month:'Jun',revenue:450000,expenses:320000,profit:130000 },
  { month:'Jul',revenue:480000,expenses:340000,profit:140000 },
  { month:'Aug',revenue:510000,expenses:360000,profit:150000 },
  { month:'Sep',revenue:530000,expenses:380000,profit:150000 },
  { month:'Oct',revenue:560000,expenses:400000,profit:160000 },
  { month:'Nov',revenue:590000,expenses:420000,profit:170000 },
  { month:'Dec',revenue:620000,expenses:450000,profit:170000 },
];

const patientDemographics: PatientDemographic[] = [
  { ageGroup:'0-18',percentage:25,color:'#06b6d4' },
  { ageGroup:'19-35',percentage:30,color:'#8b5cf6' },
  { ageGroup:'36-55',percentage:28,color:'#22c55e' },
  { ageGroup:'56-75',percentage:12,color:'#f59e0b' },
  { ageGroup:'75+',percentage:5,color:'#ef4444' },
];

const notifications: Notification[] = [
  { id:'1',title:'New patient registered',description:'John Smith has registered',time:'2 min ago',type:'info',read:false },
  { id:'2',title:'Emergency alert',description:'Code Blue in ICU Room 302',time:'5 min ago',type:'alert',read:false },
  { id:'3',title:'Lab results ready',description:'Blood work for patient #45892',time:'15 min ago',type:'success',read:false },
  { id:'4',title:'Appointment cancelled',description:'Dr. Wilson\'s 3PM cancelled',time:'30 min ago',type:'warning',read:true },
  { id:'5',title:'Inventory low',description:'Paracetamol below threshold',time:'1 hour ago',type:'warning',read:true },
  { id:'6',title:'Staff meeting',description:'Monthly review at 4PM',time:'2 hours ago',type:'info',read:true },
];

const tasks: Task[] = [
  { id:'1',title:'Review lab reports',dueDate:'Today',priority:'high',status:'pending',assignedTo:'Dr. Wilson' },
  { id:'2',title:'Approve surgery schedule',dueDate:'Today',priority:'high',status:'pending',assignedTo:'Dr. Lee' },
  { id:'3',title:'Update patient records',dueDate:'Tomorrow',priority:'medium',status:'pending',assignedTo:'Nurse Davis' },
  { id:'4',title:'Order medical supplies',dueDate:'Tomorrow',priority:'medium',status:'completed',assignedTo:'Admin' },
  { id:'5',title:'Staff meeting prep',dueDate:'Wed',priority:'low',status:'pending',assignedTo:'Dr. Wilson' },
  { id:'6',title:'Check inventory',dueDate:'Thu',priority:'low',status:'pending',assignedTo:'Admin' },
];

const upcomingEvents: UpcomingEvent[] = [
  { id:'1',title:'Cardiology Conference',date:'Dec 20',time:'9:00 AM',type:'conference',attendees:45 },
  { id:'2',title:'Surgery: Appendectomy',date:'Dec 20',time:'11:00 AM',type:'surgery',attendees:8 },
  { id:'3',title:'Staff Training',date:'Dec 21',time:'2:00 PM',type:'training',attendees:25 },
  { id:'4',title:'Board Meeting',date:'Dec 22',time:'10:00 AM',type:'meeting',attendees:12 },
  { id:'5',title:'Patient Follow-up',date:'Dec 23',time:'3:00 PM',type:'appointment',attendees:3 },
];

const patientReviews: PatientReview[] = [
  { id:'1',patientName:'John Doe',rating:5,comment:'Excellent care from Dr. Wilson!',date:'Dec 18',doctorName:'Dr. Sarah Wilson',sentiment:'positive' },
  { id:'2',patientName:'Jane Smith',rating:4,comment:'Good experience. Wait time improved.',date:'Dec 17',doctorName:'Dr. James Lee',sentiment:'neutral' },
  { id:'3',patientName:'Bob Johnson',rating:5,comment:'Life-saving treatment! Grateful!',date:'Dec 16',doctorName:'Dr. Emily Chen',sentiment:'positive' },
  { id:'4',patientName:'Alice Brown',rating:3,comment:'Average. Billing confusing.',date:'Dec 15',doctorName:'Dr. Michael Park',sentiment:'negative' },
  { id:'5',patientName:'Charlie Davis',rating:5,comment:'Best pediatrician ever!',date:'Dec 14',doctorName:'Dr. Emily Chen',sentiment:'positive' },
  { id:'6',patientName:'Diana Evans',rating:4,comment:'Professional and caring staff.',date:'Dec 13',doctorName:'Dr. Sarah Wilson',sentiment:'positive' },
];

const insuranceClaims: InsuranceClaim[] = [
  { id:'1',patientName:'Sarah Johnson',amount:'$2,450',status:'approved',date:'Dec 18',insuranceProvider:'Blue Cross' },
  { id:'2',patientName:'Robert Wilson',amount:'$5,800',status:'pending',date:'Dec 17',insuranceProvider:'Aetna' },
  { id:'3',patientName:'Maria Garcia',amount:'$1,200',status:'denied',date:'Dec 16',insuranceProvider:'UnitedHealth' },
  { id:'4',patientName:'David Kim',amount:'$3,600',status:'approved',date:'Dec 15',insuranceProvider:'Cigna' },
  { id:'5',patientName:'Lisa Thompson',amount:'$4,200',status:'pending',date:'Dec 14',insuranceProvider:'Humana' },
  { id:'6',patientName:'James Wilson',amount:'$2,800',status:'approved',date:'Dec 13',insuranceProvider:'Blue Cross' },
];

const inventoryItems: InventoryItem[] = [
  { id:'1',name:'Paracetamol',category:'Medicine',stock:450,threshold:100,status:'in-stock',lastOrdered:'Dec 10' },
  { id:'2',name:'Surgical Masks',category:'PPE',stock:80,threshold:200,status:'low',lastOrdered:'Dec 01' },
  { id:'3',name:'Syringes',category:'Equipment',stock:1200,threshold:500,status:'in-stock',lastOrdered:'Dec 05' },
  { id:'4',name:'Gloves',category:'PPE',stock:0,threshold:300,status:'out-of-stock',lastOrdered:'Nov 28' },
  { id:'5',name:'Bandages',category:'Supplies',stock:600,threshold:200,status:'in-stock',lastOrdered:'Dec 12' },
  { id:'6',name:'Antibiotics',category:'Medicine',stock:230,threshold:150,status:'in-stock',lastOrdered:'Dec 08' },
  { id:'7',name:'IV Fluids',category:'Supplies',stock:95,threshold:100,status:'low',lastOrdered:'Dec 03' },
  { id:'8',name:'X-Ray Films',category:'Equipment',stock:340,threshold:200,status:'in-stock',lastOrdered:'Dec 11' },
];

const staffMembers: StaffMember[] = [
  { id:'1',name:'Dr. Sarah Wilson',role:'Cardiologist',department:'Cardiology',status:'on-duty',shift:'Day' },
  { id:'2',name:'Nurse Davis',role:'Head Nurse',department:'ICU',status:'on-duty',shift:'Day' },
  { id:'3',name:'Dr. James Lee',role:'Neurologist',department:'Neurology',status:'off-duty',shift:'Night' },
  { id:'4',name:'Admin Smith',role:'Administrator',department:'Admin',status:'on-leave',shift:'Day' },
  { id:'5',name:'Dr. Emily Chen',role:'Pediatrician',department:'Pediatrics',status:'on-duty',shift:'Day' },
  { id:'6',name:'Nurse Johnson',role:'Staff Nurse',department:'Emergency',status:'on-duty',shift:'Night' },
  { id:'7',name:'Dr. Michael Park',role:'Orthopedic',department:'Orthopedics',status:'on-duty',shift:'Day' },
  { id:'8',name:'Receptionist Kim',role:'Front Desk',department:'Admin',status:'on-duty',shift:'Day' },
];

const hospitalMetrics: HospitalMetrics[] = [
  { id:'1',label:'Total Beds',value:'500',icon:Bed,color:'blue' },
  { id:'2',label:'Staff Count',value:'1,200',icon:Users,color:'purple' },
  { id:'3',label:'Daily OPD',value:'850',icon:Building2,color:'green' },
  { id:'4',label:'Surgeries/Month',value:'320',icon:Syringe,color:'amber' },
  { id:'5',label:'ER Visits/Day',value:'120',icon:AlertCircle,color:'red' },
  { id:'6',label:'Lab Tests/Month',value:'5,400',icon:Microscope,color:'indigo' },
  { id:'7',label:'Pharmacy Orders',value:'2,800',icon:Pill,color:'cyan' },
  { id:'8',label:'Telemedicine',value:'450',icon:Video,color:'pink' },
];

const revenueByService: RevenueByService[] = [
  { service:'Cardiology',amount:520000,percentage:22,color:'#ef4444' },
  { service:'Neurology',amount:380000,percentage:16,color:'#8b5cf6' },
  { service:'Orthopedics',amount:450000,percentage:19,color:'#f59e0b' },
  { service:'Oncology',amount:410000,percentage:17,color:'#3b82f6' },
  { service:'Pediatrics',amount:280000,percentage:12,color:'#22c55e' },
  { service:'Emergency',amount:340000,percentage:14,color:'#06b6d4' },
];

const patientFlow: PatientFlow[] = [
  { hour:'6AM',admissions:5,discharges:2 },
  { hour:'8AM',admissions:25,discharges:8 },
  { hour:'10AM',admissions:35,discharges:15 },
  { hour:'12PM',admissions:20,discharges:22 },
  { hour:'2PM',admissions:28,discharges:18 },
  { hour:'4PM',admissions:15,discharges:25 },
  { hour:'6PM',admissions:10,discharges:12 },
  { hour:'8PM',admissions:8,discharges:6 },
];

const bedOccupancyTrend: BedOccupancyTrend[] = [
  { date:'Mon',general:82,icu:88,emergency:75 },
  { date:'Tue',general:85,icu:90,emergency:80 },
  { date:'Wed',general:78,icu:85,emergency:70 },
  { date:'Thu',general:80,icu:92,emergency:78 },
  { date:'Fri',general:75,icu:80,emergency:65 },
  { date:'Sat',general:70,icu:75,emergency:60 },
  { date:'Sun',general:65,icu:70,emergency:55 },
];

const regionPerformance: RegionPerformance[] = [
  { region:'Northeast',patients:3200,revenue:'$2.8M',satisfaction:4.7 },
  { region:'Southeast',patients:2800,revenue:'$2.4M',satisfaction:4.6 },
  { region:'Midwest',patients:2400,revenue:'$2.0M',satisfaction:4.5 },
  { region:'Southwest',patients:2100,revenue:'$1.8M',satisfaction:4.8 },
  { region:'West Coast',patients:3500,revenue:'$3.1M',satisfaction:4.7 },
];

const complianceMetrics: ComplianceMetric[] = [
  { id:'1',name:'HIPAA Compliance',status:'compliant',score:98,lastAudit:'Dec 01' },
  { id:'2',name:'Data Encryption',status:'compliant',score:100,lastAudit:'Dec 05' },
  { id:'3',name:'Staff Training',status:'warning',score:85,lastAudit:'Nov 28' },
  { id:'4',name:'Equipment Safety',status:'compliant',score:95,lastAudit:'Dec 10' },
  { id:'5',name:'Waste Disposal',status:'non-compliant',score:65,lastAudit:'Dec 02' },
  { id:'6',name:'Fire Safety',status:'compliant',score:92,lastAudit:'Dec 08' },
];

// ============================================
// SUB-COMPONENTS
// ============================================
const ResourceBar: React.FC<{ resource: ResourceStatus }> = ({ resource }) => {
  const Icon = resource.icon;
  const pct = Math.round((resource.used/resource.total)*100);
  const gc = pct>85?'from-red-500 to-rose-500':pct>60?'from-amber-500 to-orange-500':'from-emerald-500 to-teal-500';
  return <div className="space-y-2"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Icon className="w-4 h-4 text-white/40"/><span className="text-white/60 text-xs font-medium">{resource.name}</span></div><div className="flex items-center gap-2"><span className={`text-[10px] font-medium ${resource.trend==='up'?'text-red-400':'text-emerald-400'}`}>{resource.change}</span><span className="text-white/30 text-[10px]">{resource.available} free</span></div></div><div className="h-2 bg-white/[0.04] rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1}} className={`h-full bg-gradient-to-r ${gc} rounded-full`}/></div></div>;
};

const AvailabilityDot: React.FC<{status:string}> = ({status}) => {
  const c:Record<string,string>={available:'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]',busy:'bg-amber-400',offline:'bg-slate-500'};
  return <span className={`w-2 h-2 rounded-full ${c[status]||'bg-slate-500'}`}/>;
};

// ============================================
// MAIN DASHBOARD (30+ SECTIONS)
// ============================================
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [greeting,setGreeting] = useState('');
  const [currentTime,setCurrentTime] = useState(new Date());
  const [isRefreshing,setIsRefreshing] = useState(false);
  const [activeTab,setActiveTab] = useState<'overview'|'analytics'|'reports'|'staff'|'inventory'|'compliance'>('overview');

  useEffect(()=>{const h=new Date().getHours();setGreeting(h<12?'Good Morning':h<18?'Good Afternoon':'Good Evening');},[]);
  useEffect(()=>{const t=setInterval(()=>setCurrentTime(new Date()),60000);return()=>clearInterval(t);},[]);
  useEffect(()=>{window.scrollTo(0,0);},[]);
  const handleRefresh=()=>{setIsRefreshing(true);setTimeout(()=>setIsRefreshing(false),1500);};

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* === HEADER === */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20"><Sparkles className="w-7 h-7 text-white"/></div>
            <div><div className="flex items-center gap-2"><h1 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.03em]">Aetherion Health</h1><span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 animate-pulse">LIVE</span></div><p className="text-white/20 text-sm mt-0.5">{currentTime.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})} • {currentTime.toLocaleTimeString()}</p></div>
          </div>
          <div className="flex items-center gap-2">
            {[{icon:Search},{icon:Bell,badge:6},{icon:Settings},{icon:RefreshCw,action:handleRefresh,spin:isRefreshing}].map((btn,i)=>{const Icon=btn.icon;return <button key={i} type="button" onClick={btn.action} className={`relative p-3 hover:bg-white/[0.06] rounded-xl transition-colors border border-white/[0.06] ${btn.spin?'animate-spin':''}`}><Icon className="w-5 h-5 text-white/40"/>{btn.badge&&<span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">{btn.badge}</span>}</button>;})}
            <div className="w-px h-10 bg-white/[0.08] mx-2"/>
            <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-base">SW</div><div className="hidden md:block"><p className="text-white text-sm font-semibold">{greeting}, Dr. Wilson</p><p className="text-white/30 text-xs">Chief Administrator</p></div></div>
          </div>
        </motion.div>

        {/* === TAB NAVIGATION === */}
        <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 w-fit overflow-x-auto">
          {(['overview','analytics','reports','staff','inventory','compliance'] as const).map(tab=><button key={tab} type="button" onClick={()=>setActiveTab(tab)} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize whitespace-nowrap ${activeTab===tab?'bg-white/[0.08] text-white shadow-lg':'text-white/40 hover:text-white/70'}`}>{tab}</button>)}
        </div>

        {/* === 12 QUICK ACTIONS === */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2.5">
          {[{icon:Calendar,label:'Book',link:'/appointments/book'},{icon:AlertCircle,label:'SOS',link:'/emergency'},{icon:Video,label:'Virtual',link:'/telemedicine'},{icon:Pill,label:'Pharmacy',link:'/pharmacy'},{icon:Brain,label:'AI Help',link:'/ai-assistant'},{icon:UserPlus,label:'Patient',link:'/patients/new'},{icon:FileText,label:'Records',link:'/records'},{icon:MessageCircle,label:'Chat',link:'/messages'},{icon:Clipboard,label:'Lab',link:'/lab'},{icon:DollarSign,label:'Billing',link:'/billing'},{icon:Syringe,label:'Vaccine',link:'/vaccine'},{icon:Truck,label:'Ambulance',link:'/ambulance'}].map((a,i)=>{const Icon=a.icon;return <motion.button key={i} type="button" whileHover={{scale:1.06,y:-3}} whileTap={{scale:0.95}} onClick={()=>navigate(a.link)} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"><Icon className="w-6 h-6 text-white/50"/><span className="text-[11px] text-white/35 font-medium">{a.label}</span></motion.button>;})}
        </div>

        {/* === 8 HOSPITAL METRICS === */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {hospitalMetrics.map((m,i)=>{const Icon=m.icon;return <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} whileHover={{y:-2}} className="bg-white/[0.015] rounded-xl border border-white/[0.06] p-4 hover:border-white/[0.12] transition-all text-center"><Icon className="w-5 h-5 text-white/30 mx-auto mb-2"/><div className="text-xl font-bold text-white">{m.value}</div><p className="text-white/30 text-[11px] mt-0.5">{m.label}</p></motion.div>;})}
        </div>

        {/* === 6 LARGE STAT CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard variant="large" title="Total Patients" value="12,847" change="+12.5%" trend="up" icon={Users} color="blue" sparkline={[30,45,55,60,75,85,90]} subtitle="Active patients"/>
          <StatCard variant="large" title="Monthly Revenue" value="$2.84M" change="+18.7%" trend="up" icon={DollarSign} color="green" sparkline={[20,35,40,55,60,78,95]} subtitle="This month"/>
          <StatCard variant="large" title="Appointments" value="1,423" change="+8.2%" trend="up" icon={Calendar} color="purple" sparkline={[40,50,60,55,70,80,90]} subtitle="Total booked"/>
          <StatCard variant="large" title="Avg Wait Time" value="8 min" change="-22%" trend="down" icon={Clock} color="amber" sparkline={[15,14,13,12,11,10,8]} subtitle="Improved"/>
          <StatCard variant="large" title="Bed Occupancy" value="78%" change="+5.1%" trend="up" icon={Bed} color="red" sparkline={[70,75,72,78,80,76,78]} subtitle="Current"/>
          <StatCard variant="large" title="Satisfaction" value="4.8/5" change="+0.3" trend="up" icon={Heart} color="pink" sparkline={[4.5,4.6,4.7,4.8,4.7,4.8,4.8]} subtitle="Average"/>
        </div>

        {/* === CHART + APPOINTMENTS + DEMOGRAPHICS + REVIEWS === */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <ActivityChart/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
                <h3 className="text-white font-semibold text-sm mb-4">Demographics</h3>
                <div className="space-y-3">{patientDemographics.map((d,i)=><div key={i} className="space-y-1"><div className="flex justify-between text-xs"><span className="text-white/50">{d.ageGroup}</span><span className="text-white/30">{d.percentage}%</span></div><div className="h-2 bg-white/[0.04] rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${d.percentage}%`}} transition={{duration:1,delay:i*0.1}} className="h-full rounded-full" style={{backgroundColor:d.color}}/></div></div>)}</div>
              </div>
              <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
                <h3 className="text-white font-semibold text-sm mb-4">Patient Flow</h3>
                <div className="flex items-end gap-1 h-32">{patientFlow.map((f,i)=><div key={i} className="flex-1 flex flex-col items-center gap-0.5"><motion.div initial={{height:0}} animate={{height:`${(f.admissions/40)*100}%`}} transition={{duration:0.8,delay:i*0.1}} className="w-full bg-gradient-to-t from-blue-500/80 to-cyan-400/80 rounded-t-sm"/><motion.div initial={{height:0}} animate={{height:`${(f.discharges/40)*100}%`}} transition={{duration:0.8,delay:i*0.1}} className="w-full bg-gradient-to-t from-emerald-500/80 to-green-400/80 rounded-t-sm"/><span className="text-white/30 text-[9px]">{f.hour}</span></div>)}</div>
                <div className="flex items-center gap-4 mt-3 justify-center"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500/80"/><span className="text-white/35 text-[10px]">Admit</span></span><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500/80"/><span className="text-white/35 text-[10px]">Discharge</span></span></div>
              </div>
              <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
                <h3 className="text-white font-semibold text-sm mb-4">Reviews</h3>
                <div className="space-y-3">{patientReviews.slice(0,4).map((r,i)=><div key={i} className="p-3 rounded-xl bg-white/[0.02]"><div className="flex items-center justify-between mb-1"><span className="text-white text-xs font-medium">{r.patientName}</span><div className="flex gap-0.5">{[...Array(5)].map((_,s)=><Star key={s} className={`w-3 h-3 ${s<r.rating?'text-amber-400 fill-amber-400':'text-white/10'}`}/>)}</div></div><p className="text-white/35 text-[10px] line-clamp-2">{r.comment}</p><p className="text-white/20 text-[10px] mt-1">{r.doctorName} • {r.date}</p></div>)}</div>
              </div>
            </div>
            {/* Bed Occupancy Trend */}
            <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
              <h3 className="text-white font-semibold text-sm mb-4">Bed Occupancy Trend (7 Days)</h3>
              <div className="flex items-end gap-2 h-40">{bedOccupancyTrend.map((b,i)=><div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full flex gap-0.5"><motion.div initial={{height:0}} animate={{height:`${b.general}%`}} transition={{duration:0.8,delay:i*0.1}} className="flex-1 bg-gradient-to-t from-blue-500/70 to-cyan-400/70 rounded-t-sm"/><motion.div initial={{height:0}} animate={{height:`${b.icu}%`}} transition={{duration:0.8,delay:i*0.1}} className="flex-1 bg-gradient-to-t from-red-500/70 to-rose-400/70 rounded-t-sm"/><motion.div initial={{height:0}} animate={{height:`${b.emergency}%`}} transition={{duration:0.8,delay:i*0.1}} className="flex-1 bg-gradient-to-t from-amber-500/70 to-orange-400/70 rounded-t-sm"/></div><span className="text-white/30 text-[10px]">{b.date}</span></div>)}</div>
              <div className="flex items-center gap-6 mt-4 justify-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500/70"/><span className="text-white/35 text-[10px]">General</span></span><span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500/70"/><span className="text-white/35 text-[10px]">ICU</span></span><span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500/70"/><span className="text-white/35 text-[10px]">ER</span></span></div>
            </div>
          </div>
          <div className="space-y-6">
            <RecentAppointments variant="card" maxItems={6} showFilters onViewAll={()=>navigate('/appointments')} onBookNew={()=>navigate('/appointments/book')}/>
            <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-5">
              <h3 className="text-white font-semibold text-sm mb-4">Notifications</h3>
              <div className="space-y-2">{notifications.map((n,i)=><div key={i} className={`p-3 rounded-xl transition-all cursor-pointer ${n.read?'bg-transparent':'bg-white/[0.02] border border-white/[0.04]'}`}><div className="flex items-start justify-between"><p className="text-white text-xs font-medium">{n.title}</p><span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${n.read?'bg-transparent':'bg-cyan-400'}`}/></div><p className="text-white/35 text-[10px] mt-0.5">{n.description}</p><p className="text-white/20 text-[10px] mt-1">{n.time}</p></div>)}</div>
            </div>
          </div>
        </div>

        {/* === REVENUE BY SERVICE + REGION PERFORMANCE === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
            <h3 className="text-white font-semibold text-sm mb-4">Revenue by Service</h3>
            <div className="space-y-3">{revenueByService.map((s,i)=><div key={i} className="space-y-1"><div className="flex justify-between text-xs"><span className="text-white/50">{s.service}</span><span className="text-white/30">${(s.amount/1000).toFixed(0)}K ({s.percentage}%)</span></div><div className="h-2 bg-white/[0.04] rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${s.percentage}%`}} transition={{duration:1,delay:i*0.1}} className="h-full rounded-full" style={{backgroundColor:s.color}}/></div></div>)}</div>
          </div>
          <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
            <h3 className="text-white font-semibold text-sm mb-4">Regional Performance</h3>
            <div className="space-y-3">{regionPerformance.map((r,i)=><div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]"><div><p className="text-white text-xs font-medium">{r.region}</p><p className="text-white/30 text-[10px]">{r.patients.toLocaleString()} patients</p></div><div className="flex items-center gap-4"><span className="text-white text-sm font-bold">{r.revenue}</span><div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400"/><span className="text-white/50 text-xs">{r.satisfaction}</span></div></div></div>)}</div>
          </div>
        </div>

        {/* === FINANCIAL OVERVIEW (12 MONTHS) === */}
        <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6"><div><h3 className="text-white font-semibold text-sm">Annual Financial Overview</h3><p className="text-white/30 text-xs mt-0.5">12-Month Revenue vs Expenses vs Profit</p></div><button type="button" className="text-cyan-400 text-xs font-medium hover:text-cyan-300">Full Report →</button></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[{label:'Annual Revenue',value:'$5.59M',icon:DollarSign,color:'text-emerald-400'},{label:'Annual Expenses',value:'$3.93M',icon:TrendingDown,color:'text-red-400'},{label:'Net Profit',value:'$1.66M',icon:TrendingUp,color:'text-blue-400'}].map((item,i)=>{const Icon=item.icon;return <div key={i} className="text-center p-4 bg-white/[0.02] rounded-xl"><Icon className={`w-6 h-6 ${item.color} mx-auto mb-2`}/><div className="text-xl font-bold text-white">{item.value}</div><div className="text-white/30 text-[11px]">{item.label}</div></div>;})}
          </div>
          <div className="flex items-end gap-1.5 h-48">{financialData.map((d,i)=><div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full flex flex-col gap-0.5"><motion.div initial={{height:0}} animate={{height:`${(d.revenue/700000)*100}%`}} transition={{duration:1,delay:i*0.05}} className="bg-gradient-to-t from-emerald-500/80 to-emerald-400/80 rounded-t-sm w-full"/><motion.div initial={{height:0}} animate={{height:`${(d.expenses/700000)*100}%`}} transition={{duration:1,delay:i*0.05}} className="bg-gradient-to-t from-red-500/60 to-red-400/60 rounded-t-sm w-full"/></div><span className="text-white/30 text-[10px]">{d.month}</span></div>)}</div>
          <div className="flex items-center gap-6 mt-4 justify-center"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500/80"/><span className="text-white/40 text-xs">Revenue</span></span><span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500/60"/><span className="text-white/40 text-xs">Expenses</span></span></div>
        </div>

        {/* === 8 GLASS STATS === */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard variant="glass" title="Bed Occupancy" value="78%" change="-2.1%" trend="down" icon={Building2} color="cyan"/>
          <StatCard variant="glass" title="Satisfaction" value="4.8/5" change="+0.3" trend="up" icon={Heart} color="pink"/>
          <StatCard variant="glass" title="Lab Tests" value="156" change="+12%" trend="up" icon={Microscope} color="indigo"/>
          <StatCard variant="glass" title="Doctors Online" value="847" change="+3.2%" trend="up" icon={Stethoscope} color="blue"/>
        </div>

        {/* === 8 QUICK STATS === */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickStats.map((s,i)=>{const Icon=s.icon;return <motion.div key={i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} whileHover={{y:-2}} className="bg-white/[0.015] rounded-xl border border-white/[0.06] p-3 hover:border-white/[0.12] transition-all text-center"><Icon className="w-4 h-4 text-white/30 mx-auto mb-1.5"/><div className="text-lg font-bold text-white">{s.value}</div><p className="text-white/30 text-[10px] truncate">{s.label}</p><span className={`text-[10px] font-medium ${s.trend==='up'?'text-emerald-400':'text-red-400'}`}>{s.change}</span></motion.div>;})}
        </div>

        {/* === RESOURCES + ACTIVITY + TASKS + EVENTS === */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center justify-between mb-6"><div><h3 className="text-white font-semibold text-sm">Resources</h3><p className="text-white/30 text-xs mt-0.5">Real-time</p></div><button type="button" onClick={()=>navigate('/hospitals')} className="text-cyan-400 text-xs font-medium">All →</button></div>
            <div className="space-y-4">{resources.map((r,i)=><motion.div key={r.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}><ResourceBar resource={r}/></motion.div>)}</div>
          </div>
          <div className="lg:col-span-2 bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4"><div><h3 className="text-white font-semibold text-sm">Recent Activity</h3><p className="text-white/30 text-xs mt-0.5">Latest 12 events</p></div><button type="button" className="text-cyan-400 text-xs font-medium">All</button></div>
            <div className="flex-1 space-y-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-1">{recentActivities.map((a,i)=><motion.div key={a.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.03}} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all"><div className={`p-1.5 rounded-lg ${a.type==='emergency'?'bg-red-500/10':a.type==='complaint'?'bg-amber-500/10':'bg-white/[0.03]'} border border-white/[0.06]`}><Activity className="w-3.5 h-3.5 text-white/50"/></div><div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2"><p className="text-white text-xs font-medium truncate">{a.title}</p><span className="text-white/20 text-[10px] shrink-0">{a.time}</span></div><p className="text-white/35 text-[10px] mt-0.5 line-clamp-1">{a.description}</p><span className="text-white/25 text-[10px]">{a.patient}</span></div></motion.div>)}</div>
          </div>
          <div className="space-y-6">
            <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-5">
              <h3 className="text-white font-semibold text-sm mb-4">Tasks</h3>
              <div className="space-y-2">{tasks.map((t,i)=><div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-all"><input type="checkbox" checked={t.status==='completed'} readOnly className="w-4 h-4 rounded border-white/20"/><div className="flex-1 min-w-0"><p className="text-white text-xs font-medium truncate">{t.title}</p><p className="text-white/25 text-[10px]">{t.assignedTo} • {t.dueDate}</p></div><span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${t.priority==='high'?'bg-red-500/10 text-red-400':t.priority==='medium'?'bg-amber-500/10 text-amber-400':'bg-slate-500/10 text-slate-400'}`}>{t.priority}</span></div>)}</div>
            </div>
            <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-5">
              <h3 className="text-white font-semibold text-sm mb-4">Upcoming</h3>
              <div className="space-y-2">{upcomingEvents.map((e,i)=><div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-all"><div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 font-bold text-xs shrink-0">{e.date.split(' ')[1]}</div><div className="flex-1 min-w-0"><p className="text-white text-xs font-medium truncate">{e.title}</p><p className="text-white/25 text-[10px]">{e.date} • {e.time} • {e.attendees} att.</p></div></div>)}</div>
            </div>
          </div>
        </div>

        {/* === DEPARTMENT OVERVIEW === */}
        <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6"><div><h3 className="text-white font-semibold text-sm">Department Overview</h3><p className="text-white/30 text-xs mt-0.5">8 departments</p></div><button type="button" onClick={()=>navigate('/departments')} className="text-cyan-400 text-xs font-medium">All →</button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{departmentStats.map((d,i)=>{const Icon=d.icon;const oc=d.occupancy>85?'text-red-400':d.occupancy>70?'text-amber-400':'text-emerald-400';return <motion.div key={d.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} whileHover={{y:-3}} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer" onClick={()=>navigate(`/departments/${d.id}`)}><div className="flex items-center justify-between mb-3"><div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center`}><Icon className="w-5 h-5 text-white"/></div><span className={`text-sm font-bold ${oc}`}>{d.occupancy}%</span></div><h4 className="text-white text-sm font-semibold">{d.name}</h4><div className="grid grid-cols-2 gap-2 mt-3 text-xs"><span className="text-white/40">{d.patients} pts</span><span className="text-white/40">{d.staff} staff</span><span className="text-white/40">{d.beds} beds</span><span className="text-white/40">{d.surgeries} surg</span></div><div className="flex items-center justify-between mt-3"><div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400"/><span className="text-white/50 text-xs">{d.satisfaction}</span></div><span className="text-white/30 text-xs">{d.revenue}</span></div><div className="mt-3 h-1.5 bg-white/[0.04] rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${d.occupancy}%`}} transition={{duration:0.8,delay:i*0.1}} className={`h-full bg-gradient-to-r ${d.color} rounded-full`}/></div></motion.div>;})}</div>
        </div>

        {/* === TOP DOCTORS === */}
        <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6"><div><h3 className="text-white font-semibold text-sm">Top Doctors</h3><p className="text-white/30 text-xs mt-0.5">8 highest rated</p></div><button type="button" onClick={()=>navigate('/doctors')} className="text-cyan-400 text-xs font-medium">All →</button></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{topDoctors.map((doc,i)=><motion.div key={doc.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} whileHover={{y:-4}} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] cursor-pointer transition-all group text-center" onClick={()=>navigate(`/doctors/${doc.id}`)}><div className="relative inline-block mb-3"><div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mx-auto">{doc.name.charAt(0)}</div><div className="absolute -bottom-1 -right-1"><AvailabilityDot status={doc.availability}/></div></div><h4 className="text-white text-sm font-semibold">{doc.name}</h4><p className="text-white/35 text-xs">{doc.specialty}</p><p className="text-white/20 text-[10px] mt-1">{doc.education}</p><div className="flex items-center justify-center gap-3 mt-3"><span className="text-white/40 text-[10px]">{doc.patients} pts</span><span className="text-white/20">•</span><div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400"/><span className="text-white/40 text-[10px]">{doc.rating}</span></div><span className="text-white/20">•</span><span className="text-white/40 text-[10px]">{doc.experience}y</span></div><p className="text-cyan-400 text-[10px] mt-2">{doc.nextAvailable}</p><p className="text-white/20 text-[10px] mt-1">${doc.consultationFee}/consult</p></motion.div>)}</div>
        </div>

        {/* === INSURANCE + INVENTORY + COMPLIANCE === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-white font-semibold text-sm">Insurance Claims</h3><button type="button" className="text-cyan-400 text-xs font-medium">All</button></div>
            <div className="space-y-2">{insuranceClaims.map((c,i)=><div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]"><div><p className="text-white text-xs font-medium">{c.patientName}</p><p className="text-white/30 text-[10px]">{c.insuranceProvider} • {c.date}</p></div><div className="flex items-center gap-3"><span className="text-white text-sm font-bold">{c.amount}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${c.status==='approved'?'bg-emerald-500/10 text-emerald-400':c.status==='pending'?'bg-amber-500/10 text-amber-400':'bg-red-500/10 text-red-400'}`}>{c.status}</span></div></div>)}</div>
          </div>
          <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-white font-semibold text-sm">Inventory</h3><button type="button" className="text-cyan-400 text-xs font-medium">All</button></div>
            <div className="space-y-2">{inventoryItems.map((inv,i)=><div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]"><div><p className="text-white text-xs font-medium">{inv.name}</p><p className="text-white/30 text-[10px]">{inv.category} • Stock: {inv.stock}</p></div><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${inv.status==='in-stock'?'bg-emerald-500/10 text-emerald-400':inv.status==='low'?'bg-amber-500/10 text-amber-400':'bg-red-500/10 text-red-400'}`}>{inv.status}</span></div>)}</div>
          </div>
          <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-white font-semibold text-sm">Compliance</h3><button type="button" className="text-cyan-400 text-xs font-medium">All</button></div>
            <div className="space-y-2">{complianceMetrics.map((cm,i)=><div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]"><div><p className="text-white text-xs font-medium">{cm.name}</p><p className="text-white/30 text-[10px]">Audit: {cm.lastAudit}</p></div><div className="flex items-center gap-3"><div className="text-right"><span className={`text-sm font-bold ${cm.status==='compliant'?'text-emerald-400':cm.status==='warning'?'text-amber-400':'text-red-400'}`}>{cm.score}%</span></div><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cm.status==='compliant'?'bg-emerald-500/10 text-emerald-400':cm.status==='warning'?'bg-amber-500/10 text-amber-400':'bg-red-500/10 text-red-400'}`}>{cm.status}</span></div></div>)}</div>
          </div>
        </div>

        {/* === STAFF STATUS === */}
        <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6"><div><h3 className="text-white font-semibold text-sm">Staff Status</h3><p className="text-white/30 text-xs mt-0.5">8 members</p></div><button type="button" onClick={()=>navigate('/staff')} className="text-cyan-400 text-xs font-medium">All →</button></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{staffMembers.map((s,i)=><motion.div key={s.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center"><div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-white font-bold mx-auto mb-3">{s.name.charAt(0)}</div><h4 className="text-white text-sm font-semibold">{s.name}</h4><p className="text-white/35 text-xs">{s.role}</p><p className="text-white/25 text-[10px] mt-1">{s.department}</p><div className="mt-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.status==='on-duty'?'bg-emerald-500/10 text-emerald-400':s.status==='off-duty'?'bg-slate-500/10 text-slate-400':'bg-amber-500/10 text-amber-400'}`}>{s.status}</span></div><p className="text-white/20 text-[10px] mt-1.5">Shift: {s.shift}</p></motion.div>)}</div>
        </div>

        {/* === FULL APPOINTMENTS LIST === */}
        <div>
          <div className="flex items-center justify-between mb-4"><div><h2 className="text-xl font-semibold text-white">All Upcoming Appointments</h2><p className="text-white/30 text-sm mt-0.5">Complete schedule for the next 7 days</p></div><button type="button" onClick={()=>navigate('/appointments')} className="flex items-center gap-1.5 text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">View Full Schedule <ArrowRight className="w-4 h-4"/></button></div>
          <RecentAppointments variant="list" maxItems={12} showFilters={false} onViewAll={()=>navigate('/appointments')}/>
        </div>

        {/* === FOOTER === */}
        <div className="text-center py-8 border-t border-white/[0.04]">
          <p className="text-white/12 text-sm">Aetherion Health Enterprise Dashboard • Real-time monitoring • Auto-refresh every 30 seconds • © 2024 Aetherion Health Systems • All Rights Reserved</p>
          <div className="flex items-center justify-center gap-6 mt-3">
            <span className="text-white/10 text-xs">v3.2.1</span><span className="text-white/10">•</span><span className="text-white/10 text-xs">HIPAA Compliant</span><span className="text-white/10">•</span><span className="text-white/10 text-xs">256-bit SSL</span><span className="text-white/10">•</span><span className="text-white/10 text-xs">99.99% Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
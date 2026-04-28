/**
 * Status Page - STUBBED FOR PUBLIC SHOWCASE
 */
import { useState, useEffect } from "react";
import { Server, Activity, ShieldCheck, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Status() {
 const navigate = useNavigate();
 const [status, setStatus] = useState<any>(null);
 const [loading, setLoading] = useState(false);
 const [lastUpdated, setLastUpdated] = useState(new Date());

 function checkStatus() {
  setLoading(true);
  // STUBBED - no API calls
  setStatus({ status: 'offline', version: 'STUBBED', uptime: 0 });
  setLoading(false);
  setLastUpdated(new Date());
 }

 useEffect(() => {
  checkStatus();
 }, []);

 return (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
   <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-300">
    <div className="flex flex-col items-center text-center space-y-2">
     <div className={`p-4 rounded-2xl ${status?.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
      <Server className="h-12 w-12" />
     </div>
     <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
     <p className="text-muted-foreground">Status is stubbed for public showcase</p>
    </div>

    <div className="grid grid-cols-1 gap-4">
     <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
      <div className="flex items-center gap-3">
       <Activity className="h-5 w-5 text-blue-500" />
       <span className="font-medium">Status</span>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status?.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
       {loading ? 'Checking...' : (status?.status || 'Offline')}
      </span>
     </div>

     <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
      <div className="flex items-center gap-3">
       <ShieldCheck className="h-5 w-5 text-purple-500" />
       <span className="font-medium">Version</span>
      </div>
      <span className="text-muted-foreground text-sm font-mono">STUBBED</span>
     </div>

     <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
      <div className="flex items-center gap-3">
       <Clock className="h-5 w-5 text-orange-500" />
       <span className="font-medium">Uptime</span>
      </div>
      <span className="text-muted-foreground text-sm">
       N/A (stubbed)
      </span>
     </div>
    </div>

    <div className="space-y-4 pt-4 text-center">
     <Button
      onClick={checkStatus}
      disabled={loading}
      className="w-full bg-[#ff7a2b] hover:bg-[#ff8a4b] text-white h-12 rounded-2xl gap-2 text-base font-semibold transition-all active:scale-95"
     >
      <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
      Refresh Status
     </Button>
     <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
      Last updated: {lastUpdated.toLocaleTimeString()}
     </p>
    </div>

    <div className="pt-2 text-center">
     <Button variant="link" className="text-xs text-muted-foreground hover:text-white transition-colors" onClick={() => navigate('/')}>
      ← Back to Player
     </Button>
    </div>
   </div>
  </div>
 );
}
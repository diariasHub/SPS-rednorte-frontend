import { useState } from 'react';
import { Siren, Activity, Clock, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { urgenciaService } from '../../../../services/urgencia.service';
import { toast } from 'sonner';

export function UrgenciasView() {
  const [activeTab, setActiveTab] = useState<'ingreso' | 'triage' | 'espera' | 'atencion'>('ingreso');

  // State for Ingreso
  const [rutIngreso, setRutIngreso] = useState('');
  const [motivo, setMotivo] = useState('');
  const [idEncuentro, setIdEncuentro] = useState('');

  // State for Triage
  const [triageId, setTriageId] = useState('');
  const [nivelTriage, setNivelTriage] = useState('1');

  // State for Espera
  const [rutEspera, setRutEspera] = useState('');
  const [tiempoEspera, setTiempoEspera] = useState<number | null>(null);

  // State for Atención
  const [atencionId, setAtencionId] = useState('');
  const [diagnostico, setDiagnostico] = useState('');

  const handleIngreso = async () => {
    try {
      const res = await urgenciaService.ingreso(rutIngreso, motivo);
      toast.success('Ingreso registrado', { description: res });
      // Extraer ID de la respuesta para setearlo en otros tabs si es necesario
      const match = res.match(/ID Encuentro:\s*(\S+)/);
      if (match && match[1]) {
        setIdEncuentro(match[1]);
        setTriageId(match[1]);
        setAtencionId(match[1]);
      }
      setRutIngreso('');
      setMotivo('');
    } catch (error) {
      toast.error('Error al registrar ingreso');
    }
  };

  const handleTriage = async () => {
    try {
      const res = await urgenciaService.triage(triageId, { nivel: parseInt(nivelTriage) });
      toast.success('Triage completado', { description: res });
    } catch (error) {
      toast.error('Error al procesar triage');
    }
  };

  const handleConsultarEspera = async () => {
    try {
      const res = await urgenciaService.consultarEspera(rutEspera);
      setTiempoEspera(res.tiempoEsperaMinutos);
      toast.success('Consulta exitosa');
    } catch (error) {
      toast.error('Error al consultar espera');
    }
  };

  const handleAlta = async () => {
    try {
      const res = await urgenciaService.alta(atencionId, diagnostico);
      toast.success('Alta registrada', { description: res });
      setDiagnostico('');
    } catch (error) {
      toast.error('Error al dar de alta');
    }
  };

  return (
    <div className="mt-[104px] md:mt-[88px] min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8 font-sans">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-[#e63946] tracking-tight flex items-center gap-3">
            <Siren className="h-8 w-8" /> Flujo de Urgencias
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Módulo de atención rápida y categorización
          </p>
        </div>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('ingreso')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'ingreso' ? 'bg-[#e63946] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          <FileText className="h-4 w-4" /> Recepción
        </button>
        <button
          onClick={() => setActiveTab('triage')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'triage' ? 'bg-[#f4a261] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          <Activity className="h-4 w-4" /> Triage
        </button>
        <button
          onClick={() => setActiveTab('espera')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'espera' ? 'bg-[#2a9d8f] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          <Clock className="h-4 w-4" /> Sala de Espera
        </button>
        <button
          onClick={() => setActiveTab('atencion')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'atencion' ? 'bg-[#004a87] text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
        >
          <CheckCircle className="h-4 w-4" /> Atención y Alta
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'ingreso' && (
          <Card className="max-w-2xl border-none shadow-md">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
              <CardTitle className="text-lg font-bold text-slate-800">Registro de Ingreso</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">RUT Paciente</label>
                <input 
                  type="text" 
                  value={rutIngreso}
                  onChange={(e) => setRutIngreso(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e63946]/20 focus:border-[#e63946] outline-none" 
                  placeholder="Ej: 12345678-9" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Motivo de Consulta</label>
                <textarea 
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e63946]/20 focus:border-[#e63946] outline-none" 
                  rows={3} 
                  placeholder="Ej: Dolor en el pecho" 
                />
              </div>
              <button onClick={handleIngreso} className="w-full bg-[#e63946] hover:bg-[#c1121f] text-white font-bold py-3 rounded-lg transition-colors">
                Registrar Ingreso
              </button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'triage' && (
          <Card className="max-w-2xl border-none shadow-md">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
              <CardTitle className="text-lg font-bold text-slate-800">Evaluación Triage</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ID Encuentro</label>
                <input 
                  type="text" 
                  value={triageId}
                  onChange={(e) => setTriageId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#f4a261]/20 focus:border-[#f4a261] outline-none" 
                  placeholder="ID generado en recepción" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nivel de Gravedad (ESI)</label>
                <select 
                  value={nivelTriage}
                  onChange={(e) => setNivelTriage(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#f4a261]/20 focus:border-[#f4a261] outline-none"
                >
                  <option value="1">ESI 1 - Riesgo Vital Inmediato</option>
                  <option value="2">ESI 2 - Riesgo Vital Alto</option>
                  <option value="3">ESI 3 - Mediana Gravedad</option>
                  <option value="4">ESI 4 - Riesgo Vital Bajo</option>
                  <option value="5">ESI 5 - Atención General</option>
                </select>
              </div>
              <button onClick={handleTriage} className="w-full bg-[#f4a261] hover:bg-[#e76f51] text-white font-bold py-3 rounded-lg transition-colors">
                Guardar Triage
              </button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'espera' && (
          <Card className="max-w-2xl border-none shadow-md">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
              <CardTitle className="text-lg font-bold text-slate-800">Consulta de Espera</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">RUT Paciente</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={rutEspera}
                    onChange={(e) => setRutEspera(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#2a9d8f]/20 focus:border-[#2a9d8f] outline-none" 
                    placeholder="Ej: 12345678-9" 
                  />
                  <button onClick={handleConsultarEspera} className="bg-[#2a9d8f] hover:bg-[#21867a] text-white font-bold px-6 rounded-lg transition-colors">
                    Consultar
                  </button>
                </div>
              </div>
              
              {tiempoEspera !== null && (
                <div className="mt-4 p-4 bg-[#e6f5f3] rounded-lg border border-[#2a9d8f]/30 flex items-center justify-between">
                  <span className="font-medium text-[#1d635a]">Tiempo estimado de espera:</span>
                  <span className="text-2xl font-black text-[#2a9d8f]">{tiempoEspera} min</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'atencion' && (
          <Card className="max-w-2xl border-none shadow-md">
            <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
              <CardTitle className="text-lg font-bold text-slate-800">Atención Médica y Alta</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ID Encuentro</label>
                <input 
                  type="text" 
                  value={atencionId}
                  onChange={(e) => setAtencionId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#004a87]/20 focus:border-[#004a87] outline-none" 
                  placeholder="ID del encuentro" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Diagnóstico Final</label>
                <textarea 
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#004a87]/20 focus:border-[#004a87] outline-none" 
                  rows={3} 
                  placeholder="Ej: Tratamiento administrado y paciente estable." 
                />
              </div>
              <button onClick={handleAlta} className="w-full bg-[#004a87] hover:bg-[#003561] text-white font-bold py-3 rounded-lg transition-colors">
                Dar de Alta
              </button>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

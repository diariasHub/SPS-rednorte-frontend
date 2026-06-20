import { urgenciaApi } from './urgencia.api';

const URGENCIAS_BASE = '/urgencias';

export const urgenciaRemote = {
  ingreso(payload: { rut: string; motivo: string }): Promise<string> {
    return urgenciaApi.post<string>(`${URGENCIAS_BASE}/ingreso`, payload).then(r => r.data);
  },

  triage(idEncuentro: string, payload: any): Promise<string> {
    return urgenciaApi.put<string>(`${URGENCIAS_BASE}/triage/${idEncuentro}`, payload).then(r => r.data);
  },

  consultarEspera(rut: string): Promise<{ rut: string; tiempoEsperaMinutos: number }> {
    return urgenciaApi.get<{ rut: string; tiempoEsperaMinutos: number }>(`${URGENCIAS_BASE}/espera/${rut}`).then(r => r.data);
  },

  rechazar(payload: { idEncuentro: string; rutConfirmacion: string }): Promise<string> {
    return urgenciaApi.put<string>(`${URGENCIAS_BASE}/rechazo`, payload).then(r => r.data);
  },

  getFicha(idEncuentro: string): Promise<any> {
    return urgenciaApi.get<any>(`${URGENCIAS_BASE}/ficha/${idEncuentro}`).then(r => r.data);
  },

  alta(idEncuentro: string, payload: { diagnostico: string }): Promise<string> {
    return urgenciaApi.put<string>(`${URGENCIAS_BASE}/alta/${idEncuentro}`, payload).then(r => r.data);
  }
};

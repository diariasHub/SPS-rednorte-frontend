import { urgenciaRemote } from '../remotes/urgencia.remote';

class UrgenciaService {
  ingreso(rut: string, motivo: string): Promise<string> {
    return urgenciaRemote.ingreso({ rut, motivo });
  }

  triage(idEncuentro: string, payload: any): Promise<string> {
    return urgenciaRemote.triage(idEncuentro, payload);
  }

  consultarEspera(rut: string): Promise<{ rut: string; tiempoEsperaMinutos: number }> {
    return urgenciaRemote.consultarEspera(rut);
  }

  rechazar(idEncuentro: string, rutConfirmacion: string): Promise<string> {
    return urgenciaRemote.rechazar({ idEncuentro, rutConfirmacion });
  }

  getFicha(idEncuentro: string): Promise<any> {
    return urgenciaRemote.getFicha(idEncuentro);
  }

  alta(idEncuentro: string, diagnostico: string): Promise<string> {
    return urgenciaRemote.alta(idEncuentro, { diagnostico });
  }
}

export const urgenciaService = new UrgenciaService();

import axios from 'axios';
import type { Doctor } from '../app/types/Booking';

// APUNTAMOS DIRECTO A LA PUERTA TRASERA (HAPI FHIR)
const FHIR_BASE_URL = 'http://localhost:8085/fhir'; 

export interface SpecialtyDTO {
  id: string;
  name: string;
  icon: string;
}

export const medicalRemote = {
  getSpecialties: async (): Promise<SpecialtyDTO[]> => {
    try {
      // Pedimos los centros/especialidades que creamos como "Location"
      const response = await axios.get(`${FHIR_BASE_URL}/Location`); 
      const bundle = response.data;
      
      // Si la base de datos no tiene entradas, devolvemos vacío
      if (!bundle.entry) return [];

      // Mapeamos el formato estándar médico a lo que entiende tu React
      return bundle.entry.map((item: any) => {
        const resource = item.resource;
        return {
          id: resource.id,
          name: resource.name || 'Sin nombre',
          icon: 'Activity' // Puedes poner un ícono por defecto
        };
      });
    } catch (error) {
      console.error("Error cargando especialidades desde FHIR", error);
      return [];
    }
  },

  getDoctorsBySpecialty: async (specialtyId: string): Promise<Doctor[]> => {
    try {
      // Pedimos los médicos ("Practitioner")
      // Nota: En FHIR real se filtraría por rol/especialidad, aquí traemos todos para probar
      const response = await axios.get(`${FHIR_BASE_URL}/Practitioner`);
      const bundle = response.data;
      
      if (!bundle.entry) return [];

      return bundle.entry.map((item: any) => {
        const doc = item.resource;
        // Buscamos el nombre dentro del formato complejo de FHIR
        const nameObj = doc.name && doc.name[0] ? doc.name[0] : null;
        const fullName = nameObj ? `${nameObj.prefix?.[0] || ''} ${nameObj.given?.join(' ') || ''} ${nameObj.family || ''}`.trim() : 'Dr. Sin Nombre';

        return {
          id: doc.id,
          name: fullName,
          title: 'Médico',
          specialty: specialtyId, // Lo forzamos a la especialidad seleccionada por ahora
          bio: 'Información traída directamente desde FHIR.',
          experience: 5,
          slots: 8
        };
      });
    } catch (error) {
      console.error("Error cargando profesionales desde FHIR", error);
      return [];
    }
  }
};
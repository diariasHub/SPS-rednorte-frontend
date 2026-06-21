import axios from 'axios';
import { urgenciaApi } from '../remotes/urgencia.api';
import { patientApi } from '../remotes/patient.api';
import { api } from '../remotes/api';

const instances = [axios, urgenciaApi, patientApi, api];

instances.forEach(instance => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token && token.trim() !== '') {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
});

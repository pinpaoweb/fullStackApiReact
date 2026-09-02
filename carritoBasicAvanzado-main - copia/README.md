# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# Calculadora de IMC - PINPAO App

Proyecto desarrollado para el programa de Software Analysis and Development (ADSO) del SENA.

## Descripción
Herramienta web para el cálculo y seguimiento del Índice de Masa Corporal (IMC). 
Incluye lógica de validación diferenciada para adultos, adultos mayores y población pediátrica.

## Funcionalidades
- **Cálculo de IMC preciso:** Adaptado para diferentes grupos etarios.
- **Validación pediátrica:** Implementación de tablas de percentiles de la OMS para niños (5-10 años).
- **Historial de usuario:** Registro persistente de cálculos mediante API REST.
- **Experiencia de usuario (UX):** Lenguaje claro y empático en los resultados, diseñado para cuidadores y padres.

## Tecnologías
- React.js
- Axios (Integración con API en Vercel)
- React Router DOM
- 
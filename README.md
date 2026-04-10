# Web Corporativa - EcoEnergía Local S.L.

**Proyecto Final de Grado Medio en Sistemas Microinformáticos y Redes**  
**Alumno:** [Jose Vargas Salazar]  
**Curso:** 2025/2026  
**Fecha:** Abril 2026

## Descripción del Proyecto

Este proyecto consiste en el desarrollo de una **página web corporativa** para la empresa ficticia **EcoEnergía Local S.L.**, dedicada a la instalación de placas solares y sistemas de autoconsumo energético.

### Problema que resuelve
La empresa actualmente no tiene presencia web profesional. Los clientes potenciales tienen que contactar por teléfono o WhatsApp para obtener información básica, lo que genera pérdida de tiempo del equipo y pérdida de leads. Esta web soluciona ese problema ofreciendo:
- Información clara de servicios y precios aproximados
- Calculadora de ahorro energético
- Portafolio de proyectos realizados
- Formulario de contacto funcional

## Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 y JavaScript vanilla
- **Backend:** PHP 8 básico (procesamiento de formularios)
- **Servidor:** Apache2 en Ubuntu Server 24.04 LTS
- **Control de versiones:** Git + GitHub
- **Entorno:** Servidor local en máquina virtual (VirtualBox)

## Estructura del Proyecto

- `/public/` → Archivos que se sirven en el navegador (raíz del servidor web)
- `/docs/` → Toda la documentación del proyecto en Markdown
- `README.md` → Este archivo (resumen general)

## Instalación y Configuración del Servidor Local

### 1. Requisitos
- VirtualBox (o cualquier hipervisor)
- Al menos 4 GB de RAM disponibles
- Conexión a internet durante la instalación

### 2. Creación de la Máquina Virtual
1. Descargar **VirtualBox** desde: https://www.virtualbox.org
2. Descargar la ISO de **Ubuntu Server 24.04.4 LTS** desde: https://ubuntu.com/download/server
3. Crear una nueva máquina virtual con las siguientes especificaciones:
   - Nombre: `ecoenergia-server`
   - Tipo: Linux → Ubuntu (64-bit)
   - Memoria RAM: **4096 MB** (recomendado)
   - CPUs: 2
   - Disco duro virtual: **25 GB** (dinámico)
   - Adaptador de red: **Adaptador Puente**
4. En la configuración de almacenamiento, montar la ISO descargada.

### 3. Instalación de Ubuntu Server
- En la pantalla GRUB seleccionar **"Try or Install Ubuntu Server"**
- Elegir idioma **Español**
- Instalar **Ubuntu Server** (no minimal)
- Configurar:
  - Nombre del servidor: `ecoenergia-server`
  - Usuario: `user` (o el que prefieras)
  - Activar **OpenSSH server**
- Esperar a que termine la instalación y reiniciar.

### 4. Instalación del Stack LAMP (Apache + PHP)
Una vez dentro del servidor, ejecutar:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install apache2 php libapache2-mod-php php-mysql mariadb-server -y
sudo systemctl enable --now apache2
sudo systemctl enable --now mysql

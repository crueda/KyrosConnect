#!/usr/bin/env python
#-*- coding: UTF-8 -*-

import json
import requests
import datetime

event_list = {
  902: "Alarma",
  903: "Pánico",
  905: "Robo",
  906: "Accidente",
  907: "No autorizado",
  908: "Coerción",
  909: "Alarma manual",
  910: "Batería baja",
  911: "Velocidad máxima",
  912: "Arranque",
  913: "Parada",
  914: "Inicio de servicio",
  915: "Parada de servicio",
  916: "Modo privado activado",
  917: "Modo privado desactivado",
  918: "Estado de alarma activado",
  919: "Estado de alarma desactivado",
  920: "Claxon activado",
  921: "Claxon desactivado",
  922: "Warning activado",
  923: "Warning desactivado",
  924: "Alimentación activada",
  925: "Alimentación desactivada",
  926: "Altavoz activado",
  927: "Altavoz desactivado",
  928: "Modo de alarma activado",
  929: "Modo de alarma desactivado",
  930: "Tiempo de parada excedido",
  931: "Apertura de brazalete activado",
  932: "Apertura de brazalete desactivado",
  933: "Brazalete activado",
  934: "Brazalete desactivado",
  935: "Hombre muerto activado",
  936: "Hombre muerto desactivado",
  937: "Cercanía de agresor activado",
  938: "Cercanía de agresor desactivado",
  939: "Separación de agresor activado",
  940: "Separación de agresor desactivado",
  941: "Enchufado",
  942: "Desenchufado",
  943: "Test de posición",
  945: "Parada no autorizada",
  947: "Horario de trabajo",
  948: "Zona obligatoria activada",
  949: "Zona obligatoria desactivada",
  950: "Zona prohibida activada",
  951: "Zona prohibida desactivada",
  952: "Zona genérica activada",
  953: "Zona genérica desactivada",
  954: "Zona de proximidad activada",
  955: "Zona de proximidad desactivada",
  956: "Zona de distancia activada",
  957: "Zona de proximidad desactivada",
  958: "Zona de proximidad afectada activada",
  959: "Zona de proximidad afectada desactivada",
  960: "Zona de distancia afectada activada",
  961: "Zona de distancia afectada desactivada",
  962: "Entrada en baliza",
  963: "Salida de baliza",
  964: "Salto de baliza",
  965: "Cinturón delantero activado",
  966: "Cinturón delantero desactivado",
  967: "Cinturón trasero activado",
  968: "Cinturón trasero desactivado",
  981: "Arranque especial",
  982: "Pausa especial",
  983: "Parada especial",
  984: "Pausa",
  985: "Reanudar",
  986: "Inicio de carga",
  987: "Fin de carga",
  988: "Inicio de descarga",
  989: "Fin de descarga",
  990: "Parada con cercanía a POI",
  991: "Cambio de conductor",
  992: "Guardar POI",
  993: "Control de horas de conducción",
  994: "Descanso semanal menor que 24h.",
  995: "Descanso reducido no permitido",
  996: "Descanso semanal no compensa el reducido",
  997: "Descanso reducido diario incorrecto",
  998: "Sin descanso semanal o diario en 24h.",
  999: "Conducción de más de 10h. en 1 día",
  1000: "Conducción con más de 2 días de 9h.",
  1001: "Exceso de conducción semanal",
  1002: "Exceso de conducción bisemanal",
  1003: "Exceso de conducción ininterrupida",
  1004: "Descansos de conducción insuficiente",
  1005: "Intervención",
  1006: "Agrupación",
  1008: "Pánico indoor",
  1009: "Tracking indoor",
  1011: "Manipulación",
  1015: "Temperatura",
  1016: "Temperatura",
  1017: "Temperatura",
  1018: "Temperatura",
  1019: "Aceleración brusca",
  1020: "Frenazo brusco",
  1021: "Proximidad",
  1026: "Inactividad excedida",
  1027: "Carga de batería",
  1028: "Alerta ambar",
  1029: "Encendido",
  1030: "Apagado",
  1031: "Chequeo",
  1032: "e-health",
  1033: "Batería agotada",
  1034: "Bateria recuperada",
  1035: "Curva brusca",
  1036: "RPM",
  1037: "Temperatura",
  1038: "Rango de sensor",
  1039: "Carga de batería apagada",
  1040: "Zona de velocidad excesiva activada",
  1041: "Nivel de batería",
  1043: "Identificación del conductor activada",
  1044: "Identificación del conductor desactivada",
  1045: "Lectura de baliza NFC",
  1046: "Salto de baliza NFC",
  1047: "Evento de escaner",
  1048: "Reinicio",
  1049: "Evento BT",
  1050: "Parada en zona",
  1051: "Apertura de puerta lateral",
  1052: "Cierre de puerta lateral",
  1053: "Apertura de puerta trasera",
  1054: "Cierre de puerta trasera",
  1055: "Inhibidor GPS"}


URL = 'https://fcm.googleapis.com/fcm/send'
HEADERS = {}
HEADERS ['Authorization'] = 'key=AIzaSyCJ96vetDlCHW-m1jSeS6WxyUjH6Tb6dzE'
HEADERS ['Content-Type'] = 'application/json'

def convertTimestamp(timestamp):
    try:
        formatDate = datetime.datetime.fromtimestamp(int(timestamp)/1000).strftime('%Y-%m-%d %H:%M:%S')
        return formatDate
    except Exception as error:
        print "Error at push module - convertTimestamp function: %s" % str(error)

def composeMessage():
    try:
        eventDescription = 'Baliza'
        title = 'Coche-01' + ' -- ' + eventDescription
        body = "Calle de la pelota2, Valladolid, España"
        msg = {}
        msg['title'] = title
        msg['message'] = body
        msg['notId'] = 1234
        msg['content-available'] = 1
        msg['image'] = 'https://images.kyroslbs.com/app/events/start.png'
        msg['vehicle_license'] = '001Demo'
        msg['device_id'] = 667
        msg['username'] = "carm"
        msg['event_type'] = 912
        msg['timestamp'] = 0
        msg['soundname'] = "ringtone"
        msg['coordinates'] = [-5.681653,42.008691]
        msg['tag'] = 1
        


        return msg
    except Exception as error:
        print "Error at push module - genMsgNotification function: %s" % str(error)

def sendTestPush():
    try:
        #token = "dfJK8yF_Y_o:APA91bHhqFFkDJSnoJhdt93cquPcNpjsTWV5pRUEAhdxEDsRNPMpAmxx718RazVZDa8evZhQYVkmrLO0Yob_2bNwyesW-VY-tAlgsLDdlAhzTIaBI2FAm7Xk1Bm8AynS-sAt77m19gtD"
        token = "ekf9DQqF7B0:APA91bFpc6hR7YQrJJXFSERLbyxhAC7iQdf1hAgZx4XXBAgYsrTlaOXPCeoJoRaPp4HBqkQW-Yu4Hbj25g_Ly_8nTGA80fe3-dUFnbHWWmCLPs76eIZOVdEXZL2zXYOtzwupQMJe1xgJ"
        data = composeMessage()
        msg = {}
        msg['registration_ids'] = [token]
        msg['data'] = data
        pushRequest = requests.post(URL, data=json.dumps(msg), headers=HEADERS, verify=False)
        response = pushRequest.status_code
        if str(response) == '200':
            print "PUSH sent"
        else:
            print "Error sending: %s" % ( str(response))
    except Exception, error:
        print "Error sending push: %s" % error

sendTestPush()

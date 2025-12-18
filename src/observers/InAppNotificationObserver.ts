import { notificationSubject } from "../events/NotificationSubject";
import { db } from "../database";
import { notification } from "../database/schema/notification";


notificationSubject.on("contract:Cancel", async (data) => { 
    
    await db.insert(notification).values({
    personId: data.personId,
    contractId: data.contractId,
    hasDelivered: true,
    canceledIn:
      new Date()
        .toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .slice(0, 10)
        .replaceAll("/", "-") +
      "T" +
      new Date()
        .toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .slice(11, 20)
        .replaceAll(" ", ""),
  });
});
"# sf-workshop"
Gioco: mappa del tesoro
Scopo: ogni utente si connette al server e può scavare (/dig) in una cella della mappa specificando le coordinate x e y
Regole: se l'utente scava in una cella ma non trova il tesoro riceverà una risposta dal server di quanto dista il tesoro più vicino
Da implementare: tempo d'attesa minimo tra un dig e l'altro per non fare sovraccarico di richieste sul server

Server: Applicazione server basata su Node.js e Express. Gestisce le richieste HTTP relative alla registrazione delle squadre, all'accesso, allo scavo nella mappa di gioco e alla visualizzazione delle informazioni sulle registrazioni. Utilizza una serie di endpoint per gestire le diverse operazioni, come la registrazione di nuove squadre, il login, la creazione della mappa di gioco e lo scavo nella mappa. Le informazioni sulle squadre registrate vengono memorizzate in una variabile globale.

Client: Axios per effettuare richieste HTTP al server all'indirizzo specificato. Si occupa principalmente di registrare una squadra, cercare il tesoro nella mappa di gioco e gestire le varie fasi della ricerca. Utilizza funzioni asincrone per attendere le risposte dalle richieste HTTP e setTimeout per aggiungere pause tra le operazioni. La funzione principale main chiama le altre funzioni in sequenza per registrare la squadra e avviare la ricerca del tesoro. La funzione findTreasure è responsabile della ricerca del tesoro nella mappa di gioco, mentre miniSearch esplora una piccola area intorno alla posizione attuale se il tesoro è molto vicino.
(in pratica è stato implementato un client che utilizzi un qualche algoritmo per trovare più tesori possibili)

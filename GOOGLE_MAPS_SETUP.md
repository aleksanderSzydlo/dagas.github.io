# 🗺️ Konfiguracja Google Maps API - DAGAS

## 📋 Instrukcje uzyskania klucza Google Maps API

### 1️⃣ **Utworzenie konta Google Cloud Platform**
1. Idź na: https://console.cloud.google.com/
2. Zaloguj się swoim kontem Google
3. Zaakceptuj warunki użytkowania

### 2️⃣ **Utworzenie projektu**
1. Kliknij **"Select a project"** → **"NEW PROJECT"**
2. Nazwa projektu: `DAGAS Website`
3. Kliknij **"CREATE"**

### 3️⃣ **Włączenie Maps JavaScript API**
1. W menu bocznym: **APIs & Services** → **Library**
2. Wyszukaj: `Maps JavaScript API`
3. Kliknij **"ENABLE"**

### 4️⃣ **Utworzenie klucza API**
1. **APIs & Services** → **Credentials**
2. **"+ CREATE CREDENTIALS"** → **"API key"**
3. Skopiuj wygenerowany klucz

### 5️⃣ **Zabezpieczenie klucza (WAŻNE!)**
1. Kliknij na utworzony klucz
2. **Application restrictions** → **HTTP referrers (web sites)**
3. Dodaj domenę: `aleksanderszydlo.github.io/*`
4. **API restrictions** → **Restrict key** → wybierz **Maps JavaScript API**
5. Kliknij **"SAVE"**

### 6️⃣ **Dodanie klucza do strony**
W pliku `index.html` zamień:
```html
src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDummy_Key_Replace_With_Real&libraries=geometry"
```

Na:
```html
src="https://maps.googleapis.com/maps/api/js?key=TWÓJ_KLUCZ_API&libraries=geometry"
```

## 💰 **Koszty**
- **200$ darmowych kredytów miesięcznie** 
- **25,000 map loads miesięcznie = DARMOWE**
- Dla małej/średniej strony to **całkowicie darmowe**

## 🔧 **Funkcje dodane w Google Maps**
- ✅ **Interaktywna mapa** z kontrolkami zoom, Street View
- ✅ **Niestandardowy marker** z logo DAGAS
- ✅ **InfoWindow** z danymi kontaktowymi
- ✅ **Obszar działania** - okrąg 2km wokół firmy
- ✅ **Stylizacja mapy** - ukryte niepotrzebne elementy
- ✅ **Animacja drop** dla markera
- ✅ **Responsywność** - działa na wszystkich urządzeniach

## 🚨 **Ważne bezpieczeństwo**
- Klucz API **MUSI być ograniczony** do Twojej domeny
- **NIE UDOSTĘPNIAJ** klucza publicznie
- Regularnie **monitoruj użycie** w Google Cloud Console

## 🆚 **Porównanie: Leaflet vs Google Maps**

| Funkcja | Leaflet (poprzednio) | Google Maps (teraz) |
|---------|---------------------|-------------------|
| **Koszty** | Darmowe | Darmowe dla małych stron |
| **Jakość map** | OpenStreetMap | Najwyższa jakość |
| **Street View** | ❌ | ✅ |
| **Satelitarne** | ❌ | ✅ |
| **Traffic** | ❌ | ✅ |
| **Miejsca biznesowe** | ❌ | ✅ |
| **Mobile UX** | Dobry | Doskonały |
| **Performance** | Średni | Najlepszy |

## 🔄 **Status migracji**
- ✅ Usunięto Leaflet CSS i JS
- ✅ Dodano Google Maps API
- ✅ Przepisano funkcję `initMap()`
- ✅ Zaktualizowano CSP headers
- ✅ Dodano zabezpieczenia
- ✅ Zachowano wszystkie funkcje

**Mapa będzie działać po dodaniu prawdziwego klucza API!**

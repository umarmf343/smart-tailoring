"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Locate } from "lucide-react"

interface TailorLocation {
  id: string
  businessName: string
  latitude: number
  longitude: number
  rating: number
}

interface TailorMapProps {
  tailors: TailorLocation[]
  onTailorSelect?: (tailorId: string) => void
  height?: string
}

export function TailorMap({ tailors, onTailorSelect, height = "400px" }: TailorMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get user's current location
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  useEffect(() => {
    if (!mapContainer.current) return

    // Load MapLibre GL JS dynamically
    const script = document.createElement("script")
    script.src = "https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"
    script.async = true

    const link = document.createElement("link")
    link.href = "https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css"
    link.rel = "stylesheet"

    document.head.appendChild(link)
    document.head.appendChild(script)

    script.onload = () => {
      const maplibregl = (window as any).maplibregl

      // Use OpenStreetMap tiles
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap Contributors",
              maxzoom: 19,
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center: userLocation ? [userLocation.lng, userLocation.lat] : [-74.006, 40.7128],
        zoom: 12,
      })

      // Add navigation controls
      map.addControl(new maplibregl.NavigationControl(), "top-right")

      // Add markers for tailors
      tailors.forEach((tailor) => {
        const el = document.createElement("div")
        el.className = "tailor-marker"
        el.style.cssText = `
          background-color: #000;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `
        el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`

        el.addEventListener("click", () => {
          if (onTailorSelect) {
            onTailorSelect(tailor.id)
          }
        })

        new maplibregl.Marker({ element: el })
          .setLngLat([tailor.longitude, tailor.latitude])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <strong>${tailor.businessName}</strong><br/>
                <span style="color: #666;">Rating: ${tailor.rating} ⭐</span>
              </div>`,
            ),
          )
          .addTo(map)
      })

      // Add user location marker if available
      if (userLocation) {
        const userEl = document.createElement("div")
        userEl.style.cssText = `
          background-color: #3b82f6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `

        new maplibregl.Marker({ element: userEl }).setLngLat([userLocation.lng, userLocation.lat]).addTo(map)
      }

      setMapLoaded(true)
    }

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [tailors, userLocation, onTailorSelect])

  return (
    <Card>
      <div className="relative" style={{ height }}>
        <div ref={mapContainer} className="w-full h-full rounded-lg" />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
        <Button onClick={getUserLocation} size="sm" className="absolute bottom-4 right-4 gap-2">
          <Locate className="h-4 w-4" />
          My Location
        </Button>
      </div>
    </Card>
  )
}

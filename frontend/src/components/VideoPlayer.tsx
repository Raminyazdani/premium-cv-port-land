/**
 * Video Player Component
 * 
 * Custom video player with support for:
 * - YouTube and Vimeo embeds
 * - Direct video files (MP4, WebM)
 * - Lazy loading
 * - Custom controls matching site theme
 * - Keyboard accessibility
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  SpeakerHigh, 
  SpeakerSlash, 
  ArrowsOutSimple,
  ArrowsInSimple,
  Spinner
} from '@phosphor-icons/react'
import { useTranslation } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  className?: string
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  lazy?: boolean
}

type VideoType = 'youtube' | 'vimeo' | 'direct'

function parseVideoUrl(url: string): { type: VideoType; id?: string } {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  )
  if (youtubeMatch) {
    return { type: 'youtube', id: youtubeMatch[1] }
  }

  // Vimeo
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/)(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/
  )
  if (vimeoMatch) {
    return { type: 'vimeo', id: vimeoMatch[1] }
  }

  // Direct video file
  return { type: 'direct' }
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

export function VideoPlayer({
  src,
  poster,
  title,
  className,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  lazy = true
}: VideoPlayerProps) {
  const t = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [progress, setProgress] = useState(0)
  
  const { type, id } = parseVideoUrl(src)
  
  // Auto-generate poster for YouTube if not provided
  const effectivePoster = poster || (type === 'youtube' && id ? getYouTubeThumbnail(id) : undefined)

  // Handle play/pause
  const togglePlay = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true)
      setIsLoading(true)
    }
    
    if (type === 'direct' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
    
    setIsPlaying(!isPlaying)
  }, [isPlaying, hasStarted, type])

  // Handle mute/unmute
  const toggleMute = useCallback(() => {
    if (type === 'direct' && videoRef.current) {
      videoRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }, [isMuted, type])

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }, [isFullscreen])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle video events
  const handleVideoLoadStart = () => setIsLoading(true)
  const handleVideoCanPlay = () => setIsLoading(false)
  const handleVideoPlay = () => setIsPlaying(true)
  const handleVideoPause = () => setIsPlaying(false)
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  // Handle keyboard controls
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault()
        togglePlay()
        break
      case 'm':
        e.preventDefault()
        toggleMute()
        break
      case 'f':
        e.preventDefault()
        toggleFullscreen()
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(
            videoRef.current.duration,
            videoRef.current.currentTime + 10
          )
        }
        break
    }
  }, [togglePlay, toggleMute, toggleFullscreen])

  // Show controls on mouse move
  const handleMouseMove = useCallback(() => {
    setShowControls(true)
  }, [])

  // Hide controls after inactivity
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true)
      return
    }
    
    const timeout = setTimeout(() => {
      setShowControls(false)
    }, 3000)
    
    return () => clearTimeout(timeout)
  }, [isPlaying, showControls])

  // Render YouTube embed
  if (type === 'youtube' && id) {
    return (
      <div 
        ref={containerRef}
        className={cn("relative aspect-video bg-black rounded-lg overflow-hidden group", className)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label={title || 'Video player'}
      >
        {!hasStarted ? (
          // Lazy load: show poster with play button
          <div className="absolute inset-0">
            {effectivePoster && (
              <img
                src={effectivePoster}
                alt={title || 'Video thumbnail'}
                className="w-full h-full object-cover"
              />
            )}
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              aria-label={t.video?.play || 'Play video'}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform">
                <Play size={32} weight="fill" className="ml-1" />
              </div>
            </button>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=${loop ? 1 : 0}&enablejsapi=1&rel=0`}
            title={title || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
    )
  }

  // Render Vimeo embed
  if (type === 'vimeo' && id) {
    return (
      <div 
        ref={containerRef}
        className={cn("relative aspect-video bg-black rounded-lg overflow-hidden group", className)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label={title || 'Video player'}
      >
        {!hasStarted ? (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            aria-label={t.video?.play || 'Play video'}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform">
              <Play size={32} weight="fill" className="ml-1" />
            </div>
          </button>
        ) : (
          <iframe
            src={`https://player.vimeo.com/video/${id}?autoplay=1&muted=${isMuted ? 1 : 0}&loop=${loop ? 1 : 0}`}
            title={title || 'Vimeo video'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
    )
  }

  // Render direct video file
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative aspect-video bg-black rounded-lg overflow-hidden group",
        className
      )}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label={title || 'Video player'}
    >
      {!hasStarted && lazy ? (
        // Lazy load: show poster with play button
        <div className="absolute inset-0">
          {effectivePoster && (
            <img
              src={effectivePoster}
              alt={title || 'Video thumbnail'}
              className="w-full h-full object-cover"
            />
          )}
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
            aria-label={t.video?.play || 'Play video'}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform">
              <Play size={32} weight="fill" className="ml-1" />
            </div>
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={effectivePoster}
            muted={isMuted}
            loop={loop}
            playsInline
            onLoadStart={handleVideoLoadStart}
            onCanPlay={handleVideoCanPlay}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onTimeUpdate={handleVideoTimeUpdate}
            className="w-full h-full object-contain"
          />
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Spinner size={48} className="animate-spin text-white" />
            </div>
          )}
          
          {/* Custom controls */}
          {controls && (
            <div 
              className={cn(
                "absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300",
                showControls || !isPlaying ? "opacity-100" : "opacity-0"
              )}
            >
              {/* Progress bar */}
              <div className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    aria-label={isPlaying ? t.video?.pause : t.video?.play}
                  >
                    {isPlaying ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                    aria-label={isMuted ? t.video?.unmute : t.video?.mute}
                  >
                    {isMuted ? <SpeakerSlash size={20} weight="fill" /> : <SpeakerHigh size={20} weight="fill" />}
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                  aria-label={isFullscreen ? t.video?.exit_fullscreen : t.video?.fullscreen}
                >
                  {isFullscreen ? (
                    <ArrowsInSimple size={20} weight="bold" />
                  ) : (
                    <ArrowsOutSimple size={20} weight="bold" />
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* Click to play/pause */}
          {!controls && (
            <button
              onClick={togglePlay}
              className="absolute inset-0"
              aria-label={isPlaying ? t.video?.pause : t.video?.play}
            />
          )}
        </>
      )}
    </div>
  )
}

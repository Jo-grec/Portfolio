/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import React from 'react'
import * as THREE from 'three'
import { useEffect, useRef, useState, Suspense } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
// import { useControls } from 'leva'

extend({ MeshLineGeometry, MeshLineMaterial })
useGLTF.preload('/tag.glb')
useTexture.preload('/band.jpg')

export default function App() {
  // const { debug } = useControls({ debug: false })
  const [cardHidden, setCardHidden] = useState(false)
  
  return (
    <div 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: cardHidden ? -1 : 0,
        pointerEvents: cardHidden ? 'none' : 'auto'
      }}
    >
      {!cardHidden && (
        <Canvas camera={{ position: [0, 0, 13], fov: 25 }} gl={{ alpha: true }}>
          <ambientLight intensity={Math.PI} />
          <Suspense fallback={<FallbackSpinner />}>
            <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
              <Band setCardHidden={setCardHidden} />
            </Physics>
            <Environment blur={0.75}>
              <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
              <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
            </Environment>
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}

function FallbackSpinner() {
  return null // Hide the loading spinner completely
}

function SpinnerRotation() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta
    ref.current.rotation.y += delta * 1.2
  })
  return null
}

function Band({ maxSpeed = 50, minSpeed = 10, setCardHidden }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef() // prettier-ignore
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3() // prettier-ignore
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 }
  const { nodes, materials } = useGLTF('/tag.glb')
  const texture = useTexture('/band.jpg')
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)
  const [isFlying, setIsFlying] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isFalling, setIsFalling] = useState(false)
  const [cardVisible, setCardVisible] = useState(true)
  const [dragStartTime, setDragStartTime] = useState(0)
  const [dragStartPos, setDragStartPos] = useState(new THREE.Vector3())

  const ropeLength = 0.5
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeLength], { enabled: !isHidden }) // prettier-ignore
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeLength], { enabled: !isHidden }) // prettier-ignore
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeLength], { enabled: !isHidden }) // prettier-ignore
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]], { enabled: !isHidden }) // prettier-ignore

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useEffect(() => {
    if (isFlying) {
      document.body.style.cursor = 'default'
    }
  }, [isFlying])

  // Function to trigger card fall-down
  const makeCardFall = () => {
    if (isHidden && !isFalling) {
      // Position card above screen and start falling
      if (card.current) {
        card.current.setTranslation({ x: 2, y: 30, z: 0 })
        card.current.setRotation({ x: 0, y: 0, z: 0 })
      }
      setCardVisible(true)
      setIsFalling(true)
      setCardHidden(false)
    }
  }

  // Expose the function globally
  useEffect(() => {
    window.makeCardFall = makeCardFall
    return () => {
      delete window.makeCardFall
    }
  }, [isHidden, isFalling])

  useFrame((state, delta) => {
    if (isFlying) {
      // Smooth fly up animation
      if (card.current) {
        const currentPos = card.current.translation()
        const flySpeed = 25 // Faster speed for quicker animation
        const flyDistance = 30 // Shorter distance for quicker disappearance
        
        // Move card up and forward (towards camera)
        card.current.setTranslation({
          x: currentPos.x,
          y: currentPos.y + flySpeed * delta,
          z: currentPos.z + flySpeed * delta * 0.3
        })
        
        // Add rotation for dramatic effect
        const currentRot = card.current.rotation()
        card.current.setRotation({
          x: currentRot.x + delta * 3,
          y: currentRot.y + delta * 2,
          z: currentRot.z + delta * 1
        })
        
        // Hide card when it's far enough up
        if (currentPos.y > flyDistance) {
          card.current.setTranslation({ x: 0, y: -100, z: 0 })
          setIsFlying(false)
          setIsHidden(true)
          setCardVisible(false)
          setCardHidden(true)
        }
      }
    } else if (isFalling) {
      // Fall down animation
      if (card.current) {
        const currentPos = card.current.translation()
        const fallSpeed = 20 // Speed of falling down
        const targetY = 0 // Target Y position (original position)
        
        // Check if we've reached the target before moving
        if (currentPos.y <= targetY) {
          card.current.setTranslation({ x: 2, y: 0, z: 0 })
          card.current.setRotation({ x: 0, y: 0, z: 0 })
          setIsFalling(false)
          setIsHidden(false)
          setCardVisible(true)
          setCardHidden(false)
        } else {
          // Move card down
          card.current.setTranslation({
            x: currentPos.x,
            y: currentPos.y - fallSpeed * delta,
            z: currentPos.z
          })
          
          // Add some rotation during fall
          const currentRot = card.current.rotation()
          card.current.setRotation({
            x: currentRot.x + delta * 1,
            y: currentRot.y + delta * 0.5,
            z: currentRot.z + delta * 0.3
          })
        }
      }
    } else if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    } else if (!isHidden && !isFalling) {
      // Add subtle swaying animation when not being dragged, hidden, or falling
      const time = state.clock.elapsedTime
      const swayX = Math.sin(time * 0.8) * 0.02
      const swayY = Math.cos(time * 0.6) * 0.015
      const swayZ = Math.sin(time * 0.4) * 0.01
      
      // Apply gentle sway to the card
      if (card.current) {
        const currentPos = card.current.translation()
        card.current.setTranslation({
          x: currentPos.x + swayX,
          y: currentPos.y + swayY,
          z: currentPos.z + swayZ
        })
      }
    }
    if (fixed.current && !isFlying) {
      // Fix most of the jitter when over pulling the card (only when not flying)
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      // Calculate catmul curve
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))
      // Tilt it back towards the screen
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    } else if (isFlying && fixed.current) {
      // During flying, make the band follow the card smoothly
      curve.points[0].copy(card.current.translation())
      curve.points[1].copy(j3.current.translation())
      curve.points[2].copy(j2.current.translation())
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))
    }
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[3, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} enabled={!isHidden}>
          {!isHidden && <BallCollider args={[0.1]} />}
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} enabled={!isHidden}>
          {!isHidden && <BallCollider args={[0.1]} />}
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} enabled={!isHidden}>
          {!isHidden && <BallCollider args={[0.1]} />}
        </RigidBody>
        <RigidBody 
          position={[2, 0, 0]} 
          ref={card} 
          {...segmentProps} 
          type={isHidden ? 'fixed' : (dragged ? 'kinematicPosition' : 'dynamic')}
          enabled={!isHidden}
        >
          {!isHidden && <CuboidCollider args={[0.8, 1.125, 0.01]} />}
          {(cardVisible || isFlying) && (
            <group
              scale={2.25}
              position={[0, -1.2, -0.05]}
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onPointerUp={(e) => {
                e.target.releasePointerCapture(e.pointerId)
                const currentTime = Date.now()
                const dragDuration = currentTime - dragStartTime
                const currentPos = new THREE.Vector3().copy(e.point)
                const dragDistance = currentPos.distanceTo(dragStartPos)
                
                // If it was a quick click (less than 200ms and small movement), make it fly
                if (dragDuration < 200 && dragDistance < 0.5 && !isFlying) {
                  setIsFlying(true)
                }
                drag(false)
              }}
              onPointerDown={(e) => {
                e.target.setPointerCapture(e.pointerId)
                setDragStartTime(Date.now())
                setDragStartPos(new THREE.Vector3().copy(e.point))
                drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
              }}>
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial map={materials.base.map} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.25} roughness={0.5} metalness={0.7} />
              </mesh>
              <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
              <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
            </group>
          )}
        </RigidBody>
      </group>
      {!isHidden && (
        <mesh ref={band}>
          <meshLineGeometry />
          <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={texture} repeat={[-3, 1]} lineWidth={1} />
        </mesh>
      )}
    </>
  )
}
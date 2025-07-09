import React, { useEffect, useRef } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-gl-cpp';

interface AROverlayProps {
  onContextCreate: (gl: any) => void;
}

export default function AROverlay({ onContextCreate }: AROverlayProps) {
  const rendererRef = useRef<Renderer | null>(null);

  const handleContextCreate = async (gl: any) => {
    // Initialize the renderer
    rendererRef.current = new Renderer();
    await rendererRef.current.initialize(gl);

    // Set up the AR rendering context
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Enable depth testing for 3D rendering
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Call the parent's context create function
    onContextCreate(gl);

    // Start the render loop
    const render = () => {
      if (rendererRef.current) {
        // Clear the screen
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Render AR content here
        renderARContent(gl);

        // Request next frame
        gl.endFrameEXP();
        requestAnimationFrame(render);
      }
    };

    render();
  };

  const renderARContent = (gl: any) => {
    // This is where you would render your AR objects
    // For now, we'll just render a simple colored overlay
    // In a real AR app, you would:
    // 1. Detect surfaces/planes
    // 2. Place 3D objects
    // 3. Track camera movement
    // 4. Render 3D models

    // Example: Render a simple AR indicator
    const vertices = new Float32Array([
      -0.5, -0.5, 0.0,
       0.5, -0.5, 0.0,
       0.0,  0.5, 0.0,
    ]);

    const colors = new Float32Array([
      1.0, 0.0, 0.0, 1.0, // Red
      0.0, 1.0, 0.0, 1.0, // Green
      0.0, 0.0, 1.0, 1.0, // Blue
    ]);

    // Create and bind vertex buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Create and bind color buffer
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Simple vertex shader
    const vertexShaderSource = `
      attribute vec3 position;
      attribute vec4 color;
      varying vec4 vColor;
      void main() {
        gl_Position = vec4(position, 1.0);
        vColor = color;
      }
    `;

    // Simple fragment shader
    const fragmentShaderSource = `
      precision mediump float;
      varying vec4 vColor;
      void main() {
        gl_FragColor = vColor;
      }
    `;

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(program, 'position');
    const colorLocation = gl.getAttribLocation(program, 'color');

    // Draw the triangle
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  return (
    <GLView
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
      onContextCreate={handleContextCreate}
    />
  );
} 
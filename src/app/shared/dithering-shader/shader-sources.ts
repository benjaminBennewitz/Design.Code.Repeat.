/* src/app/shared/dithering-shader/shader-sources.ts */
/**
 * Vertex-Programm für ein bildschirmfüllendes Dreieck ohne Vertex-Buffer.
 */
export const VERTEX_SHADER_SOURCE = `#version 300 es
    precision highp float;

    const vec2 POSITIONS[3] = vec2[3](
      vec2(-1.0, -1.0),
      vec2(3.0, -1.0),
      vec2(-1.0, 3.0)
    );

    void main() {
      gl_Position = vec4(POSITIONS[gl_VertexID], 0.0, 1.0);
    }
  `;

/**
 * Fragment-Programm mit unveränderten Mustern und Bayer-Matrizen.
 */
export const FRAGMENT_SHADER_SOURCE = `#version 300 es
    precision highp float;
    precision highp int;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_speed;
    uniform float u_intensity;
    uniform float u_zoom;
    uniform vec4 u_front_color;
    uniform vec4 u_back_color;
    uniform int u_dither_size;
    uniform int u_shape;

    out vec4 out_color;

    float smooth_step(float edge0, float edge1, float value) {
      float t = clamp((value - edge0) / (edge1 - edge0), 0.0, 1.0);
      return t * t * (3.0 - 2.0 * t);
    }

    float ellipse_mask(vec2 point, vec2 center, vec2 radius) {
      vec2 normalized_point = (point - center) / radius;
      return 1.0 - smooth_step(0.84, 1.0, dot(normalized_point, normalized_point));
    }

    float diamond_mask(vec2 point, vec2 center, vec2 radius) {
      vec2 normalized_point = abs((point - center) / radius);
      return 1.0 - smooth_step(0.82, 1.0, normalized_point.x + normalized_point.y);
    }

    float rotated_ellipse_mask(vec2 point, vec2 center, vec2 radius, float rotation) {
      float cosine = cos(rotation);
      float sine = sin(rotation);
      vec2 offset = point - center;
      vec2 rotated = vec2(
        offset.x * cosine - offset.y * sine,
        offset.x * sine + offset.y * cosine
      );
      vec2 normalized_point = rotated / radius;
      return 1.0 - smooth_step(0.84, 1.0, dot(normalized_point, normalized_point));
    }

    float bayer2(ivec2 point) {
      const float matrix[4] = float[4](0.0, 2.0, 3.0, 1.0);
      int index = (point.y & 1) * 2 + (point.x & 1);
      return (matrix[index] + 0.5) / 4.0;
    }

    float bayer4(ivec2 point) {
      const float matrix[16] = float[16](
        0.0, 8.0, 2.0, 10.0,
        12.0, 4.0, 14.0, 6.0,
        3.0, 11.0, 1.0, 9.0,
        15.0, 7.0, 13.0, 5.0
      );
      int index = (point.y & 3) * 4 + (point.x & 3);
      return (matrix[index] + 0.5) / 16.0;
    }

    float bayer8(ivec2 point) {
      const float matrix[64] = float[64](
        0.0, 48.0, 12.0, 60.0, 3.0, 51.0, 15.0, 63.0,
        32.0, 16.0, 44.0, 28.0, 35.0, 19.0, 47.0, 31.0,
        8.0, 56.0, 4.0, 52.0, 11.0, 59.0, 7.0, 55.0,
        40.0, 24.0, 36.0, 20.0, 43.0, 27.0, 39.0, 23.0,
        2.0, 50.0, 14.0, 62.0, 1.0, 49.0, 13.0, 61.0,
        34.0, 18.0, 46.0, 30.0, 33.0, 17.0, 45.0, 29.0,
        10.0, 58.0, 6.0, 54.0, 9.0, 57.0, 5.0, 53.0,
        42.0, 26.0, 38.0, 22.0, 41.0, 25.0, 37.0, 21.0
      );
      int index = (point.y & 7) * 8 + (point.x & 7);
      return (matrix[index] + 0.5) / 64.0;
    }

    float dither_threshold(ivec2 point) {
      if (u_dither_size == 2) {
        return bayer2(point);
      }

      if (u_dither_size == 8) {
        return bayer8(point);
      }

      return bayer4(point);
    }

    void main() {
      float radius_base = max(1.0, min(u_resolution.x, u_resolution.y) * 0.5);
      vec2 top_left_space = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
      vec2 normalized = ((top_left_space - u_resolution * 0.5) / radius_base) * u_zoom;
      float time = u_time * u_speed;
      float field = 0.0;

      if (u_shape == 3) {
        float breathe = sin(time * 0.82) * 0.018;
        float sway = sin(time * 0.54) * 0.035;
        vec2 cat_point = normalized;
        cat_point.x -= sway * smooth_step(-0.9, 0.75, cat_point.y);

        float head = ellipse_mask(cat_point, vec2(0.0, -0.34), vec2(0.38, 0.34));
        float body = ellipse_mask(cat_point, vec2(0.0, 0.30 + breathe), vec2(0.47, 0.62 + breathe));
        float left_ear = diamond_mask(cat_point, vec2(-0.27, -0.62), vec2(0.18, 0.28));
        float right_ear = diamond_mask(cat_point, vec2(0.27, -0.62), vec2(0.18, 0.28));
        float left_paw = ellipse_mask(cat_point, vec2(-0.20, 0.82), vec2(0.20, 0.16));
        float right_paw = ellipse_mask(cat_point, vec2(0.20, 0.82), vec2(0.20, 0.16));
        float tail_base = rotated_ellipse_mask(cat_point, vec2(0.47, 0.34), vec2(0.17, 0.50), -0.58);
        float tail_tip = rotated_ellipse_mask(cat_point, vec2(0.62, 0.02), vec2(0.14, 0.34), -0.82);
        float silhouette = max(max(max(head, body), max(left_ear, right_ear)), max(max(left_paw, right_paw), max(tail_base, tail_tip)));
        float bands = 0.58
          + 0.22 * sin(cat_point.x * 8.5 + cat_point.y * 5.8 - time * 0.72)
          + 0.12 * cos(cat_point.y * 13.0 + time * 0.46);
        float pulse = 0.06 * sin((cat_point.x - cat_point.y) * 17.0 + time * 0.9);
        field = clamp(silhouette * (bands + pulse) * (0.88 + u_intensity * 0.18), 0.0, 1.0);
      } else if (u_shape == 2) {
        vec2 first_center = vec2(-0.52 + sin(time * 0.34) * 0.22, -0.08 + cos(time * 0.27) * 0.18);
        vec2 second_center = vec2(0.38 + cos(time * 0.31) * 0.2, 0.12 + sin(time * 0.39) * 0.2);
        vec2 third_center = vec2(sin(time * 0.23) * 0.2, -0.52 + cos(time * 0.35) * 0.16);
        float first_distance = dot(normalized - first_center, normalized - first_center) + 0.075;
        float second_distance = dot(normalized - second_center, normalized - second_center) + 0.075;
        float third_distance = dot(normalized - third_center, normalized - third_center) + 0.065;
        float density = 0.30 / first_distance + 0.27 / second_distance + 0.21 / third_distance;
        float body = smooth_step(0.9, 1.28, density);
        float edge = smooth_step(0.84, 1.02, density) - smooth_step(1.02, 1.28, density);
        float bands = 0.5 + 0.5 * sin((normalized.y * 7.5 + normalized.x * 2.2) - time * 0.55 + density * 0.42);
        float shine = pow(clamp(1.0 - abs(bands * 2.0 - 1.0), 0.0, 1.0), 5.0);
        vec3 shadow_color = mix(vec3(0.015, 0.02, 0.03), u_front_color.rgb, 0.2);
        vec3 metal_color = mix(shadow_color, u_front_color.rgb, 0.26 + bands * 0.48);
        metal_color = mix(metal_color, vec3(1.0), shine * 0.78 + edge * 0.3);
        out_color = vec4(metal_color, body * min(0.82, u_front_color.a));
        return;
      } else if (u_shape == 1) {
        // Sine-Wave nach dem Dithering-Prinzip der Referenzkomponente.
        vec2 uv = gl_FragCoord.xy / max(u_resolution, vec2(1.0));
        float aspect = u_resolution.x / max(1.0, u_resolution.y);
        float wave_x = (uv.x - 0.5) * 8.0 * max(1.0, aspect * 0.62);
        float wave = cos(0.5 * wave_x - 2.0 * time)
          * sin(1.5 * wave_x + time)
          * (0.75 + 0.25 * cos(3.0 * time));
        float wave_y = (uv.y - 0.48) * 4.2;
        field = 1.0 - smooth_step(-0.95, 0.95, wave_y + wave);
        field = clamp((field - 0.08) * (0.94 + u_intensity * 0.28), 0.0, 1.0);
      } else {
        float distance_from_center = length(normalized);
        float angle = atan(normalized.y, normalized.x);
        float spiral = sin(distance_from_center * 17.5 - angle * 5.8 + time * 2.15);
        float ring = sin(distance_from_center * 23.5 - time * 1.05);
        float arm = cos(angle * 2.6 + distance_from_center * 8.2 - time * 1.55);
        float outer_fade = 1.0 - smooth_step(0.82, 1.72, distance_from_center);
        float center_hole = smooth_step(0.16, 0.34, distance_from_center);
        float energy = (spiral * 0.58 + ring * 0.24 + arm * 0.18) * 0.5 + 0.5;
        field = clamp((energy - 0.14) * (0.96 + u_intensity * 0.34) * outer_fade * center_hole, 0.0, 1.0);
      }

      ivec2 dither_point = ivec2(floor(top_left_space));
      float threshold = dither_threshold(dither_point);
      out_color = field > threshold ? u_front_color : u_back_color;
    }
  `;

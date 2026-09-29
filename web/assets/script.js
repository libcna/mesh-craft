/* ====================================================================
   Mesh Craft Documentation — Shared JavaScript
   ==================================================================== */

(function () {
  "use strict";

  // ── Mobile sidebar toggle ──────────────────────────────────────────
  const toggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        e.target !== toggle
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  // ── Active nav link ───────────────────────────────────────────────
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll("#sidebar a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    // Resolve the link relative to current page
    const resolved = new URL(href, window.location.href).pathname.replace(/\/$/, "");
    if (resolved === currentPath) a.classList.add("active");
  });

  // ── Search index ──────────────────────────────────────────────────
  // Lightweight client-side search over a static index embedded below.
  // Pages register themselves via window.SEARCH_INDEX on load; we aggregate here.

  window.SEARCH_INDEX = window.SEARCH_INDEX || [];

  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (searchInput && searchResults) {
    let debounceTimer;

    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runSearch, 200);
    });

    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim()) runSearch();
    });

    document.addEventListener("click", (e) => {
      if (!searchResults.contains(e.target) && e.target !== searchInput) {
        searchResults.classList.remove("visible");
      }
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchResults.classList.remove("visible");
        searchInput.blur();
      }
    });
  }

  function runSearch() {
    const q = (searchInput.value || "").trim().toLowerCase();
    if (!q || q.length < 2) {
      searchResults.classList.remove("visible");
      return;
    }

    const index = getSearchIndex();
    const results = index
      .filter((item) => {
        const hay = (item.title + " " + item.keywords + " " + item.excerpt).toLowerCase();
        return q.split(/\s+/).every((word) => hay.includes(word));
      })
      .slice(0, 10);

    renderResults(results, q);
  }

  function renderResults(results, q) {
    if (!results.length) {
      searchResults.innerHTML =
        '<div class="search-result-item"><div class="sri-title" style="color:var(--text-muted)">No results found</div></div>';
    } else {
      searchResults.innerHTML = results
        .map(
          (r) =>
            `<div class="search-result-item"><a href="${r.url}">
              <div class="sri-title">${highlight(r.title, q)}</div>
              <div class="sri-path">${r.path}</div>
              <div class="sri-excerpt">${highlight(r.excerpt.slice(0, 140), q)}</div>
            </a></div>`
        )
        .join("");
    }
    searchResults.classList.add("visible");
  }

  function highlight(text, q) {
    const words = q.split(/\s+/).filter(Boolean);
    let out = escHtml(text);
    words.forEach((w) => {
      const re = new RegExp("(" + escRe(w) + ")", "gi");
      out = out.replace(re, "<mark>$1</mark>");
    });
    return out;
  }

  function escHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getSearchIndex() {
    return [
      // ── Users ──────────────────────────────────────────────────────
      { title: "Using MeshCraft — Overview", path: "users/index.html", url: "/users/index.html", keywords: "meshcraft users overview no programming non-programmer", excerpt: "Everything you need to open the editor and start building 3D scenes — no programming required." },
      { title: "Installing & Running", path: "users/installing.html", url: "/users/installing.html", keywords: "install download run open platform linux windows mac autosave backup", excerpt: "How to get the MeshCraft editor onto your computer and open it for the first time." },
      { title: "Interface Tour", path: "users/interface-tour.html", url: "/users/interface-tour.html", keywords: "interface tour menu toolbar hierarchy viewport properties panel scene lights env cam tex defs mat status bar", excerpt: "What every panel, button, and toolbar does — using real screenshots of the editor." },
      { title: "Your First Scene", path: "users/first-scene.html", url: "/users/first-scene.html", keywords: "first scene tutorial beginner add box move rotate scale save undo", excerpt: "Place a shape, move it, color it, and save your work — five minutes, start to finish." },
      { title: "Shapes & Tools", path: "users/shapes-and-tools.html", url: "/users/shapes-and-tools.html", keywords: "shapes primitives box sphere cylinder cone plane torus capsule disk grid icosphere select group definition instance extrude measurement", excerpt: "Every primitive shape, how selection works, and how to group, duplicate, and extrude." },
      { title: "Materials & Lighting", path: "users/materials-and-lighting.html", url: "/users/materials-and-lighting.html", keywords: "material color roughness metallic emissive texture light environment fog background", excerpt: "Give your objects color, shine, and glow, and set the mood of the scene around them." },
      { title: "Combining Shapes (CSG)", path: "users/csg.html", url: "/users/csg.html", keywords: "csg union difference intersection boolean cut merge cutter hole", excerpt: "Cut, merge, and overlap shapes to build things a single primitive can't — no sculpting required." },
      { title: "Keyframe Animation (Users)", path: "users/animation.html", url: "/users/animation.html", keywords: "animation timeline keyframe play step linear cubic bezier interpolation", excerpt: "Make objects move, spin, resize, or change color over time using the Timeline." },
      { title: "Walk Mode", path: "users/walk-mode.html", url: "/users/walk-mode.html", keywords: "walk mode first person preview gravity jump wasd", excerpt: "Step out of the orbit camera and walk through your scene in first person." },
      { title: "Exporting Your Scene", path: "users/exporting.html", url: "/users/exporting.html", keywords: "export gltf glb blender godot unity ctrl+e", excerpt: "Send your finished scene to Blender, Godot, Unity, or any other glTF-compatible tool." },
      { title: "Keyboard Shortcuts (Users)", path: "users/keyboard-shortcuts.html", url: "/users/keyboard-shortcuts.html", keywords: "keyboard shortcut cheat sheet G R S Q F F1 F2 F3 F4 F5 F11 ctrl z y n o s e d a c x v delete space alt w ctrl t ctrl g numpad", excerpt: "A one-page cheat sheet for every shortcut in the editor." },
      { title: "FAQ & Troubleshooting", path: "users/faq.html", url: "/users/faq.html", keywords: "faq troubleshooting help lost work crash autosave question", excerpt: "Answers to the questions new users ask most." },

      // ── Developers: Core pages ────────────────────────────────────
      { title: "Overview", path: "developers/index.html", url: "/developers/index.html", keywords: "meshcraft 3d editor mc3 csg overview developer", excerpt: "MeshCraft is a 3D scene editor for the .mc3.xml format — a custom XML-based scene description supporting primitives, extrusion, CSG operations, groups, instances, lights, cameras, and keyframe animations." },
      { title: "Getting Started", path: "developers/getting-started.html", url: "/developers/getting-started.html", keywords: "install setup prerequisites build first steps keyboard shortcut source", excerpt: "How to get MeshCraft running on your machine: prerequisites, build commands, opening your first scene, keyboard shortcuts and camera controls." },
      { title: "Build & Run", path: "developers/build.html", url: "/developers/build.html", keywords: "cmake build compile run debug emscripten wasm web backend easygl", excerpt: "CMake configuration, graphics backend selection (EASYGL/SDL_RENDERER/BGFX/VULKAN), build commands, running the editor, web/WASM build with Emscripten." },
      { title: "Project Structure", path: "developers/project-structure.html", url: "/developers/project-structure.html", keywords: "directory structure src mc3 test include cmake folders", excerpt: "Overview of every directory and file in the MeshCraft repository." },
      { title: "Architecture", path: "developers/architecture.html", url: "/developers/architecture.html", keywords: "architecture subsystems data flow cna nova3d rendering game loop LoadContent BeginDraw Update Draw EndDraw", excerpt: "How MeshCraft's subsystems communicate: application loop, renderers, scene data, editor tools, and the mc3 sublibrary." },
      // ── Modules ─────────────────────────────────────────────────────
      { title: "All Modules", path: "developers/modules/index.html", url: "/developers/modules/index.html", keywords: "modules overview mc3 renderer editor scene ui", excerpt: "All MeshCraft modules and how they depend on each other." },
      { title: "MC3 Library Module", path: "developers/modules/mc3-library.html", url: "/developers/modules/mc3-library.html", keywords: "mc3 xml parser writer document material texture animation sublibrary", excerpt: "The pure-C++ mc3 sublibrary: Mc3Document, Mc3XmlParser, Mc3XmlWriter, and all data classes." },
      { title: "mc3togltf Converter", path: "developers/modules/mc3togltf.html", url: "/developers/modules/mc3togltf.html", keywords: "mc3togltf gltf glb export converter animation cli tool standalone", excerpt: "Standalone CLI tool that converts .mc3.xml files to glTF 2.0 JSON or self-contained GLB." },
      { title: "Editor Module", path: "developers/modules/editor.html", url: "/developers/modules/editor.html", keywords: "editor camera selection gizmo transform tool move rotate scale orbit pan", excerpt: "EditorCamera, SelectionManager, TransformGizmo — the 3D viewport interaction layer." },
      { title: "Renderer Module", path: "developers/modules/renderer.html", url: "/developers/modules/renderer.html", keywords: "renderer scene grid csg mesh texture animation override wireframe opengl", excerpt: "SceneRenderer and GridRenderer: how MC3 objects are drawn, CSG is evaluated, and animations override transforms." },
      { title: "Scene Panels Module", path: "developers/modules/scene.html", url: "/developers/modules/scene.html", keywords: "scene hierarchy panel properties panel ui imgui tab tree", excerpt: "SceneHierarchyPanel and PropertiesPanel: the left and right ImGui panels of the editor." },
      // ── Classes ─────────────────────────────────────────────────────
      { title: "All Classes", path: "developers/classes/index.html", url: "/developers/classes/index.html", keywords: "class reference all types index", excerpt: "Complete index of all MeshCraft C++ classes." },
      { title: "MeshCraftApplication", path: "developers/classes/MeshCraftApplication.html", url: "/developers/classes/MeshCraftApplication.html", keywords: "application game loop update draw imgui shortcuts undo push handleKeyboardShortcuts handleMouseInput", excerpt: "The central class: CNA Game subclass that owns all editor state, orchestrates Update/Draw, and hosts the ImGui UI." },
      { title: "Mc3Document", path: "developers/classes/Mc3Document.html", url: "/developers/classes/Mc3Document.html", keywords: "document load save scene materials lights cameras actions loadFromFile saveToFile", excerpt: "Top-level container for all scene data: objects, materials, textures, lights, cameras, definitions, and animation actions." },
      { title: "Mc3Object", path: "developers/classes/Mc3Object.html", url: "/developers/classes/Mc3Object.html", keywords: "object type box sphere cylinder cone plane extrude csg group instance ObjectType transform pivot material", excerpt: "Represents one node in the scene graph. Holds type, transform, material reference, optional primitive/extrude/CSG data, and children." },
      { title: "Mc3Transform", path: "developers/classes/Mc3Object.html", url: "/developers/classes/Mc3Object.html", keywords: "transform position rotation scale pivot euler xyz", excerpt: "Transform struct: position[3], rotation[3] (XYZ Euler degrees), scale[3], pivot[3]. Formula: T(pos+pivot) × R × S × T(-pivot)." },
      { title: "Mc3Material (struct)", path: "developers/classes/Mc3Object.html", url: "/developers/api/mc3-materials.html", keywords: "material pbr baseColor roughness metallic normalScale occlusionStrength emissive alphaMode doubleSided", excerpt: "PBR material: baseColor[4], roughness, metallic, normalScale, occlusionStrength, emissiveColor[3], alphaMode, alphaCutoff, doubleSided, 5 texture slots." },
      { title: "SceneRenderer", path: "developers/classes/SceneRenderer.html", url: "/developers/classes/SceneRenderer.html", keywords: "renderer draw gizmo wireframe csg texture mesh animation RenderMesh WireShape AnimOverride cache", excerpt: "Renders the entire MC3 scene to the 3D viewport using CNA's BasicEffect and pre-built unit meshes." },
      { title: "EditorCamera", path: "developers/classes/EditorCamera.html", url: "/developers/classes/EditorCamera.html", keywords: "camera orbit pan zoom yaw pitch distance target viewMatrix projectionMatrix screenRayDirection", excerpt: "Orbit camera: yaw, pitch, distance, target. Methods: orbit(), pan(), zoom(), focusOn(), reset()." },
      { title: "Mc3Animation types", path: "developers/classes/Mc3Animation.html", url: "/developers/classes/Mc3Animation.html", keywords: "animation action channel keyframe interpolation step linear cubic bezier evaluateChannel AnimatedProperty", excerpt: "All animation types: Mc3Action, Mc3Channel, Mc3Keyframe, Mc3BezierHandle, Interpolation enum, AnimatedProperty enum." },
      // ── Format Reference ────────────────────────────────────────────
      { title: "MC3 Format Reference", path: "developers/api/mc3-format.html", url: "/developers/api/mc3-format.html", keywords: "mc3 xml format reference root element v0.3 version model unit environment background fog", excerpt: "Complete reference for the MC3 XML scene format version 0.3 — root element, environment, lights, cameras, top-level structure." },
      { title: "Keyframe Animation Format", path: "developers/api/mc3-animation.html", url: "/developers/api/mc3-animation.html", keywords: "animation action channel keyframe step linear cubic bezier handle_left handle_right interp target property duration loop", excerpt: "The <actions> section — actions, channels, keyframes, interpolation modes, and animatable properties." },
      { title: "Object Types Reference", path: "developers/api/mc3-objects.html", url: "/developers/api/mc3-objects.html", keywords: "box sphere cylinder cone plane mesh extrude cross_section path group instance union difference intersection area role cutter segments", excerpt: "All supported MC3 object types with their attributes, child elements, and examples." },
      { title: "Extrude — cross_section types", path: "developers/api/mc3-objects.html", url: "/developers/api/mc3-objects.html", keywords: "extrude cross_section rect circle polygon custom inner_radius pipe hollow ring width height sides points", excerpt: "Four cross-section types for <extrude>: rect (rectangular tube), circle (solid or hollow pipe), polygon (regular N-gon), custom (arbitrary 2D polygon)." },
      { title: "Extrude — path types", path: "developers/api/mc3-objects.html", url: "/developers/api/mc3-objects.html", keywords: "extrude path line arc helix polyline bezier length axis radius angle turns twist segments", excerpt: "Five path types for <extrude>: line, arc, helix, polyline, bezier. Combine any path with any cross-section." },
      { title: "Materials & Textures Reference", path: "developers/api/mc3-materials.html", url: "/developers/api/mc3-materials.html", keywords: "material pbr texture base color roughness metallic normal emissive alpha opaque mask blend doubleSided", excerpt: "PBR material system, texture slots, alpha modes (opaque/mask/blend), and UV mapping." },
      // ── Keyboard shortcuts ──────────────────────────────────────────
      { title: "Keyboard Shortcuts (Developer build)", path: "developers/getting-started.html", url: "/developers/getting-started.html", keywords: "keyboard shortcut G R S Q F F1 F2 F3 F4 F5 F11 ctrl z y n o s e d a c x v delete space alt w ctrl t ctrl g numpad", excerpt: "G=Move, R=Rotate, S=Scale, Q=Select, F=Focus, F1-F5=Add primitives, Ctrl+Z/Y=Undo/Redo, Ctrl+G=Group, Space=Play/Pause, Alt+W=Wireframe, Numpad 1/3/5/7/9=preset views." },
      { title: "Camera Controls", path: "developers/getting-started.html", url: "/developers/getting-started.html", keywords: "camera mouse middle orbit right pan scroll zoom numpad view preset front side top back bottom", excerpt: "Middle-drag=Orbit, Right-drag=Pan, Scroll=Zoom. Numpad 1=Front, 3=Right, 5=Back, 7=Top, 9=Bottom." },
      // ── Tutorials ───────────────────────────────────────────────────
      { title: "All Tutorials", path: "developers/tutorials/index.html", url: "/developers/tutorials/index.html", keywords: "tutorials index guide step by step", excerpt: "Index of all step-by-step MeshCraft tutorials." },
      { title: "Tutorial: Minimal Scene", path: "developers/tutorials/minimal-example.html", url: "/developers/tutorials/minimal-example.html", keywords: "tutorial minimal scene first example ground plane box light material xml", excerpt: "Step-by-step tutorial: create a scene with a ground plane, a box, a material, and a light — both from the editor and by hand-editing XML." },
      { title: "Tutorial: Loading a Scene", path: "developers/tutorials/loading-scene.html", url: "/developers/tutorials/loading-scene.html", keywords: "tutorial load open scene hierarchy viewport navigate house", excerpt: "How to open an existing .mc3.xml file, navigate the hierarchy, explore properties, and save changes." },
      { title: "Tutorial: CSG Operations", path: "developers/tutorials/csg-operations.html", url: "/developers/tutorials/csg-operations.html", keywords: "tutorial csg union difference intersection boolean subtract role cutter manifold xml", excerpt: "How to combine primitives using Constructive Solid Geometry: union, difference, intersection." },
      { title: "Tutorial: Export to glTF/GLB", path: "developers/tutorials/export-gltf.html", url: "/developers/tutorials/export-gltf.html", keywords: "tutorial export gltf glb mc3togltf game engine godot blender unity verify", excerpt: "Building mc3togltf, running conversion, what gets exported (primitives, materials, animation), and common problems." },
      { title: "Tutorial: Keyframe Animation", path: "developers/tutorials/animation.html", url: "/developers/tutorials/animation.html", keywords: "tutorial animation timeline keyframe play loop action channel bounce spin visibility xml", excerpt: "Creating and playing keyframe animations: actions, channels, interpolation modes, and glTF export." },
      { title: "Tutorial: Complete Scene Example", path: "developers/tutorials/complete-example.html", url: "/developers/tutorials/complete-example.html", keywords: "tutorial complete garden scene example annotated", excerpt: "A full garden scene combining environment, PBR materials, lights, cameras, CSG, definitions, interactive actions, extrusion, and keyframe animation." },
      // ── Internals ───────────────────────────────────────────────────
      { title: "Internals Overview", path: "developers/internals/index.html", url: "/developers/internals/index.html", keywords: "internals developer contributor single source of truth immediate mode imgui invariants", excerpt: "Key design principles: single document source of truth, ImGui immediate mode, full-document undo snapshots." },
      { title: "Data Flow Internals", path: "developers/internals/data-flow.html", url: "/developers/internals/data-flow.html", keywords: "data flow internals load update draw pipeline pushUndo mutation save AnimOverride playback", excerpt: "How data moves through MeshCraft: load path, edit path (pushUndo + mutate), save path, animation playback, mc3togltf pipeline." },
      { title: "Rendering Pipeline Internals", path: "developers/internals/rendering-pipeline.html", url: "/developers/internals/rendering-pipeline.html", keywords: "rendering pipeline draw call sequence opengl es easygl shader unit mesh tessellation transform selection highlight web emscripten", excerpt: "Per-frame draw call sequence, transform formula, mesh cache, primitive tessellation, shader architecture, selection highlight." },
      { title: "CSG Engine Internals", path: "developers/internals/csg-engine.html", url: "/developers/internals/csg-engine.html", keywords: "csg manifold boolean mesh evaluation cache child role fallback watertight nested", excerpt: "Manifold v3 integration: evaluation pipeline, child roles, cache lifecycle, fallback rendering, nested CSG, mc3togltf limitation." },
      { title: "Undo/Redo System Internals", path: "developers/internals/undo-redo.html", url: "/developers/internals/undo-redo.html", keywords: "undo redo snapshot stack deep copy Mc3Document MAX_UNDO pushUndo clearCaches pointer dangle", excerpt: "20-step deep-copy snapshot stack: pushUndo(), undo(), redo(), cache invalidation, what is NOT undoable." },
    ];
  }

  // ── Keyboard shortcut: / → focus search ───────────────────────────
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "/" &&
      document.activeElement !== searchInput &&
      !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  // ── Add <style> for <mark> highlight ──────────────────────────────
  const markStyle = document.createElement("style");
  markStyle.textContent = "mark{background:rgba(108,142,245,0.35);color:var(--text-heading);border-radius:2px;}";
  document.head.appendChild(markStyle);
})();

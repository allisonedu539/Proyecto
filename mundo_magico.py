#!/usr/bin/env python3
"""Aventura de emociones para jugar en el terminal, sin imágenes ni dependencias."""

import json
import os
from pathlib import Path


PROGRESS_FILE = Path(__file__).with_name("mundo_magico_terminal.json")
AREAS = [
    {
        "id": "joy",
        "name": "Jardín de la Alegría",
        "symbol": "🌈",
        "decoration": "🌷",
        "reward": "Flor arcoíris",
        "questions": [
            ("🐰 Conejita terminó su torre y salta de emoción. ¿Cómo se siente?",
             ["Alegre", "Triste", "Enojada"], 0,
             "Está alegre porque algo bonito pasó."),
            ("🐻 Osito tiene una pelota. Su amiga también quiere jugar. ¿Qué puede hacer?",
             ["Invitarla a jugar", "Esconder la pelota", "Irse sin decir nada"], 0,
             "Jugar juntos puede ser divertido."),
            ("🦊 Zorrito sonríe y quiere contar algo bonito. ¿Qué cara muestra alegría?",
             ["Una sonrisa", "Un puchero", "Ceño fruncido"], 0,
             "La sonrisa puede mostrarnos alegría."),
        ],
    },
    {
        "id": "sadness",
        "name": "Lago de la Tristeza",
        "symbol": "🌧️",
        "decoration": "🪷",
        "reward": "Nenúfar luminoso",
        "questions": [
            ("🐼 Panda extraña a su familia cuando se despide. ¿Qué podría sentir?",
             ["Tristeza", "Alegría", "Sorpresa"], 0,
             "Todas las emociones merecen espacio."),
            ("🐨 Koala se siente triste y quiere estar con alguien. ¿Qué puede hacer su amiga?",
             ["Escuchar y acompañar", "Decirle que no llore", "Alejarse riendo"], 0,
             "Escuchar y acompañar es una forma bonita de ayudar."),
            ("🐸 Ranita extraña un juguete que perdió. ¿Qué palabras amables podríamos decir?",
             ["Estoy aquí contigo", "No importa, cállate", "Es tu culpa"], 0,
             "Una amiga puede escuchar y acompañar."),
        ],
    },
    {
        "id": "anger",
        "name": "Volcán del Enojo",
        "symbol": "🌋",
        "decoration": "💎",
        "reward": "Cristal brillante",
        "questions": [
            ("🦁 Alguien derribó sin querer los bloques del león. ¿Qué podría sentir?",
             ["Enojo", "Calma", "Alegría"], 0,
             "Podemos sentir enojo y buscar qué hacer."),
            ("🐯 Tigre siente mucho enojo cuando le toca esperar. ¿Qué puede probar?",
             ["Parar y respirar despacio", "Empujar a un amigo", "Gritar muy cerca"], 0,
             "Una pausa para respirar puede ayudar."),
            ("🐵 Mono y su amigo quieren el mismo columpio. ¿Qué solución pueden intentar?",
             ["Turnarse", "Empujarse", "Quitar el columpio"], 0,
             "Turnarse es una solución justa."),
        ],
    },
    {
        "id": "fear",
        "name": "Cueva del Miedo",
        "symbol": "🌙",
        "decoration": "⭐",
        "reward": "Estrella protectora",
        "questions": [
            ("🦔 Erizo escucha un ruido nuevo y se acerca a su maestra. ¿Qué podría sentir?",
             ["Miedo", "Aburrimiento", "Alegría"], 0,
             "Pedir compañía cuando sentimos miedo está muy bien."),
            ("🐱 Gatita tiene miedo de entrar a un lugar oscuro. ¿Qué puede hacer?",
             ["Pedir que alguien la acompañe", "Irse sola sin avisar", "Burlarse de sí misma"], 0,
             "Podemos pedir ayuda cuando algo nos da miedo."),
            ("🐢 Tortuga está nerviosa antes de probar algo nuevo. ¿Qué le podríamos decir?",
             ["Podemos probar juntos", "No tengas miedo", "Hazlo rápido"], 0,
             "Ofrecer compañía le recuerda que no está sola."),
        ],
    },
    {
        "id": "calm",
        "name": "Bosque de la Calma",
        "symbol": "🍃",
        "decoration": "🦋",
        "reward": "Mariposa tranquila",
        "questions": [
            ("🐉 Lumi quiere enseñarte a respirar. Sigue estos pasos con calma.",
             [], None,
             "Una respiración suave puede ayudarnos a hacer una pausa."),
            ("🦥 Perezoso nota que su cuerpo está inquieto. ¿Qué puede ayudarle?",
             ["Respirar lento", "Correr más rápido", "Empujar una silla"], 0,
             "Respirar despacio ayuda al cuerpo a descansar."),
            ("🐦 Pajarito quiere contar cómo se siente. ¿Qué podemos hacer?",
             ["Escuchar con calma", "Interrumpirlo", "Irnos mientras habla"], 0,
             "Escuchar con calma ayuda a que se sienta acompañado."),
        ],
    },
]

SKILLS = [
    "Reconocer emociones",
    "Expresarse con palabras",
    "Escuchar y practicar empatía",
    "Resolver situaciones de convivencia",
    "Respirar y hacer una pausa",
]

PRESENTIAL_IDEAS = [
    "Imiten caras frente a un espejo y adivinen cómo se siente cada personaje.",
    "Usen un peluche para representar un conflicto y pensar soluciones amables.",
    "Huelan una flor imaginaria y soplen una vela para practicar una respiración lenta.",
    "Nombren emociones sin juzgarlas: todas pueden visitarnos.",
]


def new_progress():
    return {"stars": 0, "completed": [], "history": [], "chest_opened": False}


def load_progress():
    try:
        stored = json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return new_progress()
    except (OSError, json.JSONDecodeError) as error:
        print(f"\nNo se pudo leer el progreso guardado: {error}")
        return new_progress()

    if not isinstance(stored, dict):
        return new_progress()
    known_ids = {area["id"] for area in AREAS}
    completed = stored.get("completed", [])
    history = stored.get("history", [])
    return {
        "stars": stored.get("stars", 0) if isinstance(stored.get("stars", 0), int) else 0,
        "completed": [area_id for area_id in completed if area_id in known_ids]
        if isinstance(completed, list) else [],
        "history": [
            item for item in history
            if isinstance(item, dict)
            and item.get("id") in known_ids
            and isinstance(item.get("date"), str)
        ] if isinstance(history, list) else [],
        "chest_opened": stored.get("chest_opened") is True,
    }


def save_progress(progress):
    try:
        PROGRESS_FILE.write_text(
            json.dumps(progress, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    except OSError as error:
        print(f"\nNo se pudo guardar el progreso: {error}")


def print_title():
    print("\n" + "=" * 58)
    print("       ✨ MUNDO MÁGICO: LA ISLA DE LAS EMOCIONES ✨")
    print("                 Una aventura con Lumi 🐉")
    print("=" * 58)


def ask_choice(prompt, minimum, maximum):
    while True:
        try:
            answer = input(prompt).strip()
        except EOFError:
            return None
        if answer.isdigit() and minimum <= int(answer) <= maximum:
            return int(answer)
        print(f"Escribe un número del {minimum} al {maximum} para continuar.")


def accessible_areas(progress):
    completed = set(progress["completed"])
    return [
        index for index, area in enumerate(AREAS)
        if index == 0 or AREAS[index - 1]["id"] in completed
    ]


def show_map(progress):
    completed = set(progress["completed"])
    available = set(accessible_areas(progress))
    print("\n        ⭐ ~~~~~~~~ CAMINO DE LUCES ~~~~~~~~ ⭐")
    for index, area in enumerate(AREAS):
        if index in available:
            status = "✓ explorada" if area["id"] in completed else "¡lista!"
        else:
            status = "🔒 se abre al completar la isla anterior"
        print(f"          {area['symbol']}  {index + 1}. {area['name']} — {status}")
        if index < len(AREAS) - 1:
            print("                    ⋰  ✦  ⋱")
    decorations = [
        area["decoration"] for area in AREAS
        if area["id"] in completed
    ]
    print("\n  Lumi: ¡Elige una isla iluminada para comenzar!")
    print(f"  Estrellas: {progress['stars']}  |  Decoraciones de tu isla: "
          f"{' '.join(decorations) if decorations else 'todavía ninguna'}")
    print("  El progreso se guarda en este equipo; tus emociones no se califican.")


def guide_breathing():
    print("\n  🌼 Huele una flor imaginaria... inspira suave.")
    input("  Cuando estés listo, pulsa Enter. ")
    print("  🕯️ Ahora sopla una vela imaginaria... suelta el aire despacito.")
    input("  Cuando estés listo, pulsa Enter. ")
    print("  💚 ¡Lo hiciste! Tu cuerpo descansó un poquito.")


def play_adventure(area, progress):
    print(f"\n  ✨ ¡Llegamos al {area['name']}! ✨")
    print("  " + "─" * 50)
    for number, (prompt, options, correct, feedback) in enumerate(area["questions"], 1):
        print(f"\n  Reto {number} de {len(area['questions'])}")
        print(f"  {prompt}")
        if correct is None:
            guide_breathing()
            print(f"\n  Lumi: {feedback}")
            continue

        for option_index, option in enumerate(options, 1):
            print(f"    {option_index}. {option}")
        choice = ask_choice("  Elige una respuesta: ", 1, len(options))
        if choice is None:
            print("\n  Cerramos el juego por ahora. ¡Puedes continuar otro día!")
            return False
        if choice - 1 == correct:
            print(f"\n  Lumi: ¡Muy bien! {feedback}")
        else:
            print(f"\n  Lumi: ¡Gracias por intentarlo! Podemos pensarlo juntos. {feedback}")
        input("  Pulsa Enter para seguir con Lumi... ")

    is_new = area["id"] not in progress["completed"]
    if is_new:
        from datetime import date

        progress["completed"].append(area["id"])
        progress["stars"] += 1
        progress["history"].insert(
            0, {"id": area["id"], "date": date.today().strftime("%d/%m/%Y")}
        )
        progress["chest_opened"] = False
        save_progress(progress)
        print("\n" + "  ✨ " * 9)
        print(f"\n  🏅 ¡Aventura completada! Ganaste una estrella.")
        print(f"  🎁 Nueva decoración para tu isla: {area['reward']} {area['decoration']}")
        print("  ¡Cada emoción merece ser escuchada!")
        print("  ✨ " * 9)
    else:
        print("\n  ¡Aventura completada! Puedes jugarla otra vez cuando quieras.")
    return True


def open_treasure(progress):
    if not progress["completed"]:
        print("\n  🎁 Completa una aventura para encontrar el primer regalo.")
        return
    if progress["chest_opened"]:
        print("\n  El cofre está vacío por ahora. ¡Completa otra aventura para otro regalo!")
        return

    progress["chest_opened"] = True
    save_progress(progress)
    latest = next(
        (area for area in AREAS if area["id"] == progress["history"][0]["id"]),
        None,
    )
    if latest:
        print("\n  " + "✨  " * 8)
        print(f"  ¡SORPRESA! El cofre tenía: {latest['reward']} {latest['decoration']}")
        print("  " + "✨  " * 8)


def show_teacher(progress):
    print("\n  ☼ RINCÓN DOCENTE")
    print("  ──────────────────────────────────────────────")
    print(f"\n  Aventuras exploradas: {len(progress['completed'])} de {len(AREAS)}")
    print("\n  Bitácora:")
    if progress["history"]:
        area_names = {area["id"]: area["name"] for area in AREAS}
        for entry in progress["history"]:
            print(f"    • {area_names[entry['id']]} — {entry['date']}")
    else:
        print("    Todavía no hay aventuras completadas.")
    print("\n  Habilidades que florecen:")
    for skill in SKILLS:
        print(f"    • {skill}")
    print("\n  Ideas para jugar juntos:")
    for idea in PRESENTIAL_IDEAS:
        print(f"    • {idea}")
    print("\n  El registro no guarda ni califica las respuestas emocionales.")


def main():
    progress = load_progress()
    print_title()
    while True:
        print("\n  1. Explorar el mapa")
        print("  2. Rincón docente")
        print("  3. Abrir el cofre sorpresa")
        print("  4. Borrar progreso de este equipo")
        print("  5. Salir")
        choice = ask_choice("\n  ¿Qué te gustaría hacer? ", 1, 5)
        if choice is None or choice == 5:
            print("\n  ¡Gracias por jugar! Lumi te espera en la próxima aventura. 🐉")
            return
        if choice == 1:
            show_map(progress)
            island = ask_choice(
                "\n  Escribe el número de una isla o 0 para volver al menú: ", 0, len(AREAS)
            )
            if island is None:
                print("\n  ¡Hasta pronto, explorador!")
                return
            if island == 0:
                continue
            area_index = island - 1
            if area_index not in accessible_areas(progress):
                print("\n  Esa isla todavía descansa. Completa primero la isla anterior.")
                continue
            completed = play_adventure(AREAS[area_index], progress)
            if completed and area_index < len(AREAS) - 1:
                next_area = AREAS[area_index + 1]
                print(f"\n  🗺️ ¡El camino brilla! Se desbloqueó: {next_area['name']}.")
        elif choice == 2:
            show_teacher(progress)
            input("\n  Pulsa Enter para volver al menú... ")
        elif choice == 3:
            open_treasure(progress)
        elif choice == 4:
            confirm = input("\n  ¿Borrar el progreso local? Escribe SI para confirmar: ").strip()
            if confirm.casefold() == "si":
                progress = new_progress()
                save_progress(progress)
                print("  El progreso se borró de este equipo.")
            else:
                print("  No se hicieron cambios.")


if __name__ == "__main__":
    main()

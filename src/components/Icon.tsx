import { createEffect, createSignal, type Accessor, type Signal } from "solid-js";

const icons = {
	icons: new Map<string, Signal<HTMLTemplateElement | null>>(),
	fetchIcon: (name: string): Accessor<SVGElement | null> => {
		if (import.meta.env.SSR) return () => null;

		const signal = icons.icons.get(name);
		if (!signal) {
			icons.icons.set(name, createSignal<HTMLTemplateElement | null>(null));

			fetch(`/icons/${name}.svg`)
				.then((res) => {
					if (!res.ok) return null
					return res.text()
				}).then(html => {
					if (!html) {
						console.warn(`Icon /icons/${name}.svg not found`)
						return
					}

					const [_, setter] = icons.icons.get(name)!;
					const template = document.createElement("template");
					template.innerHTML = html;
					setter(template);
				})
		}

		let node: SVGElement | null = null

		return () => {
			if (node) return node;

			const [template, _] = icons.icons.get(name)!;
			const content = template()?.content.firstChild;
			if (!content) return null;

			node = content.cloneNode(true) as SVGElement;
			return node
		};
	}
}

type Props = { name: string; class?: string };

/** 
 * Fetches svg icon from host
*/
export default function Icon(props: Props) {
	const { name } = props;
	const icon = icons.fetchIcon(name)

	createEffect(() => {
		const svg = icon()
		if (!svg) return;

		if (props.class)
			svg.setAttribute('class', props.class)
	})

	return <>{icon()}</>
}

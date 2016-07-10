ALTER TABLE public.hunde ALTER COLUMN vater TYPE integer USING pc_chartoint(vater);
ALTER TABLE public.hunde ADD CONSTRAINT hunde_vater_fkey FOREIGN KEY (hunde)
			REFERENCES public.hunde (bid) MATCH SIMPLE
			ON UPDATE CASCADE ON DELETE NO ACTION;
ALTER TABLE public.hunde ALTER COLUMN mutter TYPE integer USING pc_chartoint(mutter);
ALTER TABLE public.hunde ADD CONSTRAINT hunde_mutter_fkey FOREIGN KEY (hunde)
			REFERENCES public.hunde (bid) MATCH SIMPLE
			ON UPDATE CASCADE ON DELETE NO ACTION;